import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SavedJobsPage from '../pages/SavedJobsPage'
import { api } from '../utils/api'

// Mock the API helper module
vi.mock('../utils/api', () => ({
  api: {
    getSavedJobs: vi.fn(),
    saveJob: vi.fn(),
    deleteSavedJob: vi.fn(),
    updateSavedJobStatus: vi.fn(),
  }
}))

// Mock NumberTicker component to avoid framer-motion JSDOM timing issues
vi.mock('../../components/NumberTicker', () => ({
  default: ({ value, suffix = '' }: any) => <span>{value}{suffix}</span>
}))

describe('SavedJobsPage', () => {
  const mockNewAnalysis = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders zero-scan premium placeholder screen when analysisResult is null', () => {
    render(<SavedJobsPage analysisResult={null} onNewAnalysis={mockNewAnalysis} />)
    
    expect(screen.getByText('No Job Recommendations Yet')).toBeInTheDocument()
    expect(screen.getByText(/Upload your resume and a target job description/i)).toBeInTheDocument()
    
    const startBtn = screen.getByRole('button', { name: /Start First Analysis/i })
    fireEvent.click(startBtn)
    expect(mockNewAnalysis).toHaveBeenCalledOnce()
  })

  it('loads saved jobs on mount and renders them correctly', async () => {
    const mockJobs = [
      {
        id: 1,
        user_id: 1,
        title: 'Python Software Engineer',
        company: 'Innovatech Corp',
        location: 'Remote',
        link: 'https://example.com/job1',
        status: 'saved' as const
      },
      {
        id: 2,
        user_id: 1,
        title: 'React Developer',
        company: 'UI Builders',
        location: 'Chicago, IL (Hybrid)',
        link: 'https://example.com/job2',
        status: 'applied' as const
      }
    ]
    
    vi.mocked(api.getSavedJobs).mockResolvedValue(mockJobs)
    
    render(<SavedJobsPage analysisResult={{ jobs: [] }} onNewAnalysis={mockNewAnalysis} />)
    
    await waitFor(() => {
      expect(api.getSavedJobs).toHaveBeenCalled()
    })
    
    expect(screen.getByText('Python Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('React Developer')).toBeInTheDocument()
    expect(screen.getByText('Innovatech Corp')).toBeInTheDocument()
    expect(screen.getByText('UI Builders')).toBeInTheDocument()
  })

  it('allows unsaving a job by clicking the delete/bookmark icon', async () => {
    const mockJobs = [
      {
        id: 10,
        user_id: 1,
        title: 'Fullstack Architect',
        company: 'BaseCamp',
        location: 'Remote',
        link: 'https://example.com',
        status: 'saved' as const
      }
    ]
    
    vi.mocked(api.getSavedJobs).mockResolvedValue(mockJobs)
    vi.mocked(api.deleteSavedJob).mockResolvedValue({ message: 'Deleted' })
    
    render(<SavedJobsPage analysisResult={{ jobs: [] }} onNewAnalysis={mockNewAnalysis} />)
    
    await waitFor(() => {
      expect(screen.getByText('Fullstack Architect')).toBeInTheDocument()
    })
    
    const bookmarkBtn = screen.getByTitle('Remove Bookmark')
    fireEvent.click(bookmarkBtn)
    
    await waitFor(() => {
      expect(api.deleteSavedJob).toHaveBeenCalledWith(10)
    })
    
    await waitFor(() => {
      expect(screen.queryByText('Fullstack Architect')).not.toBeInTheDocument()
    })
  })

  it('displays recommended openings from analysisResult and allows saving them', async () => {
    vi.mocked(api.getSavedJobs).mockResolvedValue([])
    vi.mocked(api.saveJob).mockResolvedValue({
      id: 50,
      user_id: 1,
      title: 'View Docker Jobs on LinkedIn',
      company: 'LinkedIn',
      location: 'Remote / Hybrid',
      status: 'saved' as const
    })

    const mockAnalysisResult = {
      jobs: [
        {
          title: 'View Docker Jobs on LinkedIn',
          platform: 'LinkedIn',
          skill: 'docker',
          url: 'https://linkedin.com/jobs/search?q=docker'
        }
      ]
    }

    render(<SavedJobsPage analysisResult={mockAnalysisResult} onNewAnalysis={mockNewAnalysis} />)

    // Open explore drawer
    const exploreBtn = screen.getByRole('button', { name: /Find New Jobs/i })
    fireEvent.click(exploreBtn)

    expect(screen.getByText('Recommended Openings')).toBeInTheDocument()
    expect(screen.getByText('View Docker Jobs on LinkedIn')).toBeInTheDocument()

    // Click save
    const saveJobBtn = screen.getByRole('button', { name: /Save Job/i })
    fireEvent.click(saveJobBtn)

    await waitFor(() => {
      expect(api.saveJob).toHaveBeenCalledWith({
        title: 'View Docker Jobs on LinkedIn',
        company: 'LinkedIn',
        location: 'Remote / Hybrid',
        link: 'https://linkedin.com/jobs/search?q=docker'
      })
    })
  })
})
