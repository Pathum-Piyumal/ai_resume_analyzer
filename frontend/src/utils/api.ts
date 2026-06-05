import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Inject JWT token into headers for every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('resumeiq-auth-token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Types for responses
export interface BulletPointImprovement {
  before: string
  after: string
}

export interface CourseLink {
  platform: string
  skill: string
  title: string
  url: string
}

export interface JobLink {
  platform: string
  skill: string
  title: string
  url: string
}

export interface AnalysisResult {
  match_score: number
  resume_skills: string[]
  jd_skills: string[]
  missing_skills: string[]
  formatting_issues: string[]
  bullet_points_improvements: BulletPointImprovement[]
  career_suggestions: string[]
  courses: CourseLink[]
  jobs: JobLink[]
  resume_text_preview: string
}

export interface UserResponse {
  id: number
  email: string
  role: 'job_seeker' | 'admin'
}

export interface TokenResponse {
  access_token: string
  token_type: string
  role: 'job_seeker' | 'admin'
}

export interface SavedJob {
  id: number
  user_id: number
  title: string
  company: string
  location?: string
  link?: string
  status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected'
}

export interface ScanSummary {
  id: number
  file_name: string
  match_score: number
  scanned_at: string
}

export interface ScanDetail {
  id: number
  file_name: string
  match_score: number
  resume_text: string
  job_description: string
  parsed_data: AnalysisResult | string // parsed_data is stored as JSON string or parsed Dict
  scanned_at: string
}

export interface DashboardStats {
  total_scans: number
  avg_score: number
  total_skills_matched: number
  match_history: {
    id: number
    scanned_at: string
    match_score: number
    file_name: string
  }[]
  skills_gap: {
    top_strengths: string[]
    top_gaps: string[]
  }
  pipeline: {
    saved: number
    applied: number
    interviewing: number
    offer: number
    rejected: number
  }
}

export interface UserSettings {
  theme: string
  email_notifications: boolean
}

// API methods
export const api = {
  // Auth
  async register(email: string, password: string): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>('/auth/register', { email, password })
    return response.data
  },

  async login(email: string, password: string): Promise<TokenResponse> {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    
    const response = await apiClient.post<TokenResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  async getMe(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/auth/me')
    return response.data
  },

  // Analyzer
  async analyzeResume(file: File, jobDescription: string): Promise<AnalysisResult> {
    const formData = new FormData()
    formData.append('resume', file)
    formData.append('job_description', jobDescription)

    const response = await apiClient.post<AnalysisResult>('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  analyzeResumeStream(
    file: File, 
    jobDescription: string, 
    onProgress: (progress: number, stepText: string) => void,
    onComplete: (result: AnalysisResult) => void,
    onError: (errorMsg: string) => void
  ): AbortController {
    const abortController = new AbortController()
    const formData = new FormData()
    formData.append('resume', file)
    formData.append('job_description', jobDescription)
    
    const token = localStorage.getItem('resumeiq-auth-token')
    
    ;(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/analyze/stream`, {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: formData,
          signal: abortController.signal
        })
        
        if (!response.ok) {
          const text = await response.text()
          let errDetail = 'An error occurred during analysis.'
          try {
            const errObj = JSON.parse(text)
            errDetail = errObj.detail || errDetail
          } catch {
            // ignore
          }
          throw new Error(errDetail)
        }
        
        if (!response.body) {
          throw new Error('ReadableStream not supported by browser.')
        }
        
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          
          for (const line of lines) {
            if (!line.trim()) continue
            try {
              const data = JSON.parse(line)
              if (data.status === 'progress') {
                onProgress(data.progress, data.message)
              } else if (data.status === 'completed') {
                onComplete(data.result)
              } else if (data.status === 'error') {
                throw new Error(data.message)
              }
            } catch (err: any) {
              onError(err.message || 'Error parsing server response.')
              abortController.abort()
              return
            }
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return
        onError(err.message || 'Could not connect to the backend server. Please make sure the backend is running.')
      }
    })()
    
    return abortController
  },

  // Saved Jobs
  async getSavedJobs(): Promise<SavedJob[]> {
    const response = await apiClient.get<SavedJob[]>('/jobs/saved')
    return response.data
  },

  async saveJob(job: { title: string; company: string; location?: string; link?: string }): Promise<SavedJob> {
    const response = await apiClient.post<SavedJob>('/jobs/saved', job)
    return response.data
  },

  async deleteSavedJob(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/jobs/saved/${id}`)
    return response.data
  },

  async updateSavedJobStatus(jobId: number, status: string): Promise<SavedJob> {
    const response = await apiClient.put<SavedJob>(`/jobs/saved/${jobId}/status`, { status })
    return response.data
  },

  // History
  async getScanHistory(): Promise<ScanSummary[]> {
    const response = await apiClient.get<ScanSummary[]>('/history')
    return response.data
  },

  async getScanDetail(id: number): Promise<ScanDetail> {
    const response = await apiClient.get<ScanDetail>(`/history/${id}`)
    return response.data
  },

  async deleteScanHistory(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/history/${id}`)
    return response.data
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/history/stats')
    return response.data
  },

  // Settings
  async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get<UserSettings>('/settings')
    return response.data
  },

  async updateSettings(settings: UserSettings): Promise<UserSettings> {
    const response = await apiClient.put<UserSettings>('/settings', settings)
    return response.data
  },
}
