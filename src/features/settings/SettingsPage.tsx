import { useTranslation } from 'react-i18next'
import { UserCircleIcon, GearIcon, LockKeyIcon } from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/widgets/SectionCard'
import { StatRow } from '@/components/widgets/StatRow'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6" data-testid="page-settings">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <SectionCard title={t('settings.account')} icon={UserCircleIcon}>
            <StatRow label={t('settings.fullName')} value="Test User" />
            <StatRow label={t('settings.role')} value="Insurance Officer" />
            <StatRow label={t('settings.email')} value="test@drivescore.kz" />
          </SectionCard>

          <SectionCard title={t('settings.preferences')} icon={GearIcon}>
            <div className="flex items-center justify-between border-b py-2.5 text-sm last:border-b-0">
              <span className="text-muted-foreground">{t('settings.language')}</span>
              <LanguageSwitcher />
            </div>
          </SectionCard>
        </div>

        <SectionCard title={t('settings.changePassword')} icon={LockKeyIcon}>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('settings.currentPassword')}</label>
              <Input type="password" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('settings.newPassword')}</label>
              <Input type="password" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('settings.confirmPassword')}</label>
              <Input type="password" />
            </div>
            <Button type="submit" className="self-start">
              {t('settings.changePasswordButton')}
            </Button>
          </form>
        </SectionCard>
      </div>
    </div>
  )
}
