import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage'
import { api } from '../utils/api'

// Mock the API helper module
vi.mock('../utils/api', () => ({
  api: {
    forgotPassword: vi.fn(),
  }
}))

describe('ForgotPasswordPage', () => {
  const mockBackToLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders forgot password screen inputs and headers', () => {
    render(<ForgotPasswordPage onBackToLogin={mockBackToLogin} />)
    
    expect(screen.getByText('Reset your password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /SEND RESET LINK/i })).toBeInTheDocument()
  })

  it('calls forgotPassword API on form submission and displays success panel', async () => {
    vi.mocked(api.forgotPassword).mockResolvedValue({ message: 'Sent link' })
    
    render(<ForgotPasswordPage onBackToLogin={mockBackToLogin} />)
    
    const emailInput = screen.getByPlaceholderText('name@company.com')
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    
    const submitBtn = screen.getByRole('button', { name: /SEND RESET LINK/i })
    fireEvent.click(submitBtn)
    
    // Check loading indicator during submission
    expect(screen.getByText(/Sending reset link.../i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(api.forgotPassword).toHaveBeenCalledWith('user@example.com')
    })
    
    // Asserts success message matches email
    expect(screen.getByText('Check your email')).toBeInTheDocument()
    expect(screen.getByText(/user@example.com/i)).toBeInTheDocument()
  })

  it('displays API error notice when submission fails', async () => {
    const errorResponse = {
      response: {
        data: {
          detail: 'No account found with this email address.'
        }
      }
    }
    vi.mocked(api.forgotPassword).mockRejectedValue(errorResponse)
    
    render(<ForgotPasswordPage onBackToLogin={mockBackToLogin} />)
    
    const emailInput = screen.getByPlaceholderText('name@company.com')
    fireEvent.change(emailInput, { target: { value: 'unknown@example.com' } })
    
    const submitBtn = screen.getByRole('button', { name: /SEND RESET LINK/i })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByText('No account found with this email address.')).toBeInTheDocument()
    })
  })

  it('triggers onBackToLogin when back link is clicked', () => {
    render(<ForgotPasswordPage onBackToLogin={mockBackToLogin} />)
    
    const backBtn = screen.getByRole('button', { name: /Back to Login/i })
    fireEvent.click(backBtn)
    
    expect(mockBackToLogin).toHaveBeenCalledOnce()
  })
})
