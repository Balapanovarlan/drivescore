import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import DashboardPage from '@/features/dashboard/DashboardPage'
import DriversPage from '@/features/drivers/DriversPage'
import DriverDetailPage from '@/features/drivers/DriverDetailPage'
import SimulatorPage from '@/features/simulator/SimulatorPage'
import ImportPage from '@/features/import/ImportPage'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import SettingsPage from '@/features/settings/SettingsPage'
import StyleguidePage from '@/features/styleguide/StyleguidePage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
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
      { path: 'styleguide', element: <StyleguidePage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
