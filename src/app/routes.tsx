import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import DashboardPage from '@/features/dashboard/DashboardPage'
import DriversPage from '@/features/drivers/DriversPage'
import DriverDetailPage from '@/features/drivers/DriverDetailPage'
import SimulatorPage from '@/features/simulator/SimulatorPage'
import ImportPage from '@/features/import/ImportPage'
import LoginPage from '@/features/auth/LoginPage'
import { RequireAdmin } from '@/features/auth/RequireAdmin'
import { RequireAuth } from '@/features/auth/RequireAuth'
import SettingsPage from '@/features/settings/SettingsPage'
import StyleguidePage from '@/features/styleguide/StyleguidePage'
import UsersPage from '@/features/users/UsersPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  // /register intentionally removed — admins create users via /users.
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'drivers', element: <DriversPage /> },
          { path: 'drivers/:id', element: <DriverDetailPage /> },
          { path: 'simulator', element: <SimulatorPage /> },
          { path: 'import', element: <ImportPage /> },
          { path: 'settings', element: <SettingsPage /> },
          {
            path: 'users',
            element: (
              <RequireAdmin>
                <UsersPage />
              </RequireAdmin>
            ),
          },
          { path: 'styleguide', element: <StyleguidePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
