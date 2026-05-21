import type { ReactNode } from 'react'
import { FireIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-2/5 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
            <FireIcon size={20} weight="fill" />
          </span>
          <span className="text-lg font-extrabold">{t('app.name')}</span>
        </div>
        <p className="text-2xl font-semibold leading-snug">{t('login.tagline')}</p>
        <span className="text-sm text-white/60">{t('app.tagline')}</span>
      </div>
      <div className="relative flex flex-1 items-center justify-center p-8">
        <div className="absolute right-6 top-6">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
