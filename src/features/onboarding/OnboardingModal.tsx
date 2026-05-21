import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FireIcon,
  GaugeIcon,
  UsersIcon,
  SlidersHorizontalIcon,
  UploadSimpleIcon,
  ShieldCheckIcon,
  CaretLeftIcon,
  CaretRightIcon,
  XIcon,
  type Icon,
} from '@phosphor-icons/react'
import { useMe } from '@/api/hooks/useMe'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'drivescore.onboarding.completed'

interface Step {
  icon: Icon
  titleKey: string
  bodyKey: string
  /** If set, the step is only shown to users with this role. */
  roleGate?: 'admin'
}

const STEPS: Step[] = [
  {
    icon: FireIcon,
    titleKey: 'onboarding.steps.welcome.title',
    bodyKey: 'onboarding.steps.welcome.body',
  },
  {
    icon: GaugeIcon,
    titleKey: 'onboarding.steps.dashboard.title',
    bodyKey: 'onboarding.steps.dashboard.body',
  },
  {
    icon: UsersIcon,
    titleKey: 'onboarding.steps.drivers.title',
    bodyKey: 'onboarding.steps.drivers.body',
  },
  {
    icon: SlidersHorizontalIcon,
    titleKey: 'onboarding.steps.simulator.title',
    bodyKey: 'onboarding.steps.simulator.body',
  },
  {
    icon: UploadSimpleIcon,
    titleKey: 'onboarding.steps.import.title',
    bodyKey: 'onboarding.steps.import.body',
  },
  {
    icon: ShieldCheckIcon,
    titleKey: 'onboarding.steps.users.title',
    bodyKey: 'onboarding.steps.users.body',
    roleGate: 'admin',
  },
]

export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function resetOnboarding(): void {
  localStorage.removeItem(STORAGE_KEY)
}

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const { t } = useTranslation()
  const me = useMe()
  const isAdmin = me.data?.role === 'admin'
  const steps = STEPS.filter((s) => !s.roleGate || (s.roleGate === 'admin' && isAdmin))
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!open) setIndex(0)
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, steps.length - 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, steps.length, onClose])

  if (!open) return null

  const step = steps[index]
  const StepIcon = step.icon
  const isLast = index === steps.length - 1

  function complete() {
    localStorage.setItem(STORAGE_KEY, 'true')
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-[2rem] bg-card shadow-2xl">
        {/* Tinted hero with the step icon */}
        <div className="relative flex flex-col items-center gap-4 bg-primary px-8 py-10 text-primary-foreground">
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/15 text-primary-foreground transition-colors hover:bg-white/25"
          >
            <XIcon size={16} weight="bold" />
          </button>
          <span className="flex size-16 items-center justify-center rounded-2xl bg-white/20">
            <StepIcon size={32} weight="fill" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
            {t('onboarding.stepCounter', { current: index + 1, total: steps.length })}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <h2 id="onboarding-title" className="text-xl font-bold tracking-tight">
            {t(step.titleKey)}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t(step.bodyKey)}
          </p>

          {/* Dot indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t('onboarding.goToStep', { n: i + 1 })}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === index ? 'w-6 bg-primary' : 'w-2 bg-muted hover:bg-secondary',
                )}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              disabled={index === 0}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <CaretLeftIcon size={16} />
              {t('common.back')}
            </button>

            {isLast ? (
              <button
                type="button"
                onClick={complete}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
              >
                {t('onboarding.done')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
                className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
              >
                {t('onboarding.next')}
                <CaretRightIcon size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={complete}
            className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {t('onboarding.skip')}
          </button>
        </div>
      </div>
    </div>
  )
}
