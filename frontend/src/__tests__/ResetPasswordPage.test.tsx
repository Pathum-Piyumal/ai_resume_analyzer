import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ResetPasswordPage from '../pages/public/ResetPasswordPage'
import { api } from '../utils/api'

// Mock the API helper module
vi.mock('../utils/api', () => ({
  api: {
    resetPassword: vi.fn(),
  }
}))

describe('ResetPasswordPage', () => {
  const mockBackToLogin = vi.fn()
  const testToken = 'abc-123-token'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders reset password screen fields and headers', () => {
    render(<ResetPasswordPage token={testToken} onBackToLogin={mockBackToLogin} />)
    
    expect(screen.getByText('Choose a new password')).toBeInTheDocument()
    expect(screen.getByLabelText(/^New Password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Confirm Password$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /RESET PASSWORD/i })).toBeInTheDocument()
  })

  it('validates password length threshold', async () => {
    render(<ResetPasswordPage token={testToken} onBackToLogin={mockBackToLogin} />)
    
    const passInput = screen.getByLabelText(/^New Password$/i)
    const confirmInput = screen.getByLabelText(/^Confirm Password$/i)
    
    fireEvent.change(passInput, { target: { value: '123' } })
    fireEvent.change(confirmInput, { target: { value: '123' } })
    
    const submitBtn = screen.getByRole('button', { name: /RESET PASSWORD/i })
    fireEvent.click(submitBtn)
    
    expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument()
    expect(api.resetPassword).not.toHaveBeenCalled()
  })

  it('validates matching passwords', async () => {
    render(<ResetPasswordPage token={testToken} onBackToLogin={mockBackToLogin} />)
    
    const passInput = screen.getByLabelText(/^New Password$/i)
    const confirmInput = screen.getByLabelText(/^Confirm Password$/i)
    
    fireEvent.change(passInput, { target: { value: 'Password123' } })
    fireEvent.change(confirmInput, { target: { value: 'Different123' } })
    
    const submitBtn = screen.getByRole('button', { name: /RESET PASSWORD/i })
    fireEvent.click(submitBtn)
    
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument()
    expect(api.resetPassword).not.toHaveBeenCalled()
  })

  it('calls resetPassword API on successful validation and displays success screen', async () => {
    vi.mocked(api.resetPassword).mockResolvedValue({ message: 'Success' })
    
    render(<ResetPasswordPage token={testToken} onBackToLogin={mockBackToLogin} />)
    
    const passInput = screen.getByLabelText(/^New Password$/i)
    const confirmInput = screen.getByLabelText(/^Confirm Password$/i)
    
    fireEvent.change(passInput, { target: { value: 'NewPassword123!' } })
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } })
    
    const submitBtn = screen.getByRole('button', { name: /RESET PASSWORD/i })
    fireEvent.click(submitBtn)
    
    expect(screen.getByText(/Saving new password.../i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(api.resetPassword).toHaveBeenCalledWith(testToken, 'NewPassword123!')
    })
    
    expect(screen.getByText('Password updated!')).toBeInTheDocument()
    
    const loginLinkBtn = screen.getByRole('button', { name: /Go to Login/i })
    fireEvent.click(loginLinkBtn)
    expect(mockBackToLogin).toHaveBeenCalledOnce()
  })

  it('displays API error details if token reset fails', async () => {
    const errorResponse = {
      response: {
        data: {
          detail: 'The password reset token is invalid or has expired.'
        }
      }
    }
    vi.mocked(api.resetPassword).mockRejectedValue(errorResponse)
    
    render(<ResetPasswordPage token={testToken} onBackToLogin={mockBackToLogin} />)
    
    const passInput = screen.getByLabelText(/^New Password$/i)
    const confirmInput = screen.getByLabelText(/^Confirm Password$/i)
    
    fireEvent.change(passInput, { target: { value: 'NewPassword123!' } })
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } })
    
    const submitBtn = screen.getByRole('button', { name: /RESET PASSWORD/i })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByText('The password reset token is invalid or has expired.')).toBeInTheDocument()
    })
  })
})
