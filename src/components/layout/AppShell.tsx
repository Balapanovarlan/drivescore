import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useMe } from '@/api/hooks/useMe'
import {
  OnboardingModal,
  hasCompletedOnboarding,
} from '@/features/onboarding/OnboardingModal'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const [navOpen, setNavOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const me = useMe()

  // Auto-open the onboarding tour the first time a signed-in user lands
  // on the app. We wait for /auth/me so admin-only steps are gated.
  useEffect(() => {
    if (me.data && !hasCompletedOnboarding()) {
      setTourOpen(true)
    }
  }, [me.data])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onMenuClick={() => setNavOpen(true)}
          onHelpClick={() => setTourOpen(true)}
        />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <OnboardingModal open={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  )
}
