import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Automatically clean up DOM after each test
afterEach(() => {
  cleanup()
})

// Mock matchMedia API which is not implemented in JSDOM by default
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
