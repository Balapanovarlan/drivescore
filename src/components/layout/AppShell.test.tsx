import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import '@/i18n'
import { AppShell } from './AppShell'

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <div data-testid="page-dashboard">D</div> },
          { path: 'drivers', element: <div data-testid="page-drivers">R</div> },
        ],
      },
    ],
    { initialEntries: [path] },
  )
  return render(<RouterProvider router={router} />)
}

describe('AppShell', () => {
  it('renders the sidebar brand on the dashboard route', () => {
    renderAt('/')
    expect(screen.getByText('DriveScore')).toBeInTheDocument()
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
  })

  it('keeps the same sidebar brand on the drivers route', () => {
    renderAt('/drivers')
    expect(screen.getByText('DriveScore')).toBeInTheDocument()
    expect(screen.getByTestId('page-drivers')).toBeInTheDocument()
  })
})
