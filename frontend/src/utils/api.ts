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
  status: 'saved' | 'applied'
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

  // History
  async getScanHistory(): Promise<ScanSummary[]> {
    const response = await apiClient.get<ScanSummary[]>('/history')
    return response.data
  },

  async getScanDetail(id: number): Promise<ScanDetail> {
    const response = await apiClient.get<ScanDetail>(`/history/${id}`)
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
