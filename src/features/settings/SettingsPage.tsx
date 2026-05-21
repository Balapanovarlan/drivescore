import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { UserCircleIcon, GearIcon, LockKeyIcon } from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/widgets/SectionCard'
import { StatRow } from '@/components/widgets/StatRow'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { changePassword } from '@/api/auth.api'
import { useMe } from '@/api/hooks/useMe'

export default function SettingsPage() {
  const { t } = useTranslation()
  const me = useMe()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
      setLocalError(null)
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLocalError(null)
    if (newPassword.length < 4) {
      setLocalError(t('settings.passwordTooShort'))
      return
    }
    if (newPassword !== confirm) {
      setLocalError(t('register.passwordMismatch'))
      return
    }
    mutation.mutate()
  }

  const apiError =
    mutation.error && axios.isAxiosError(mutation.error)
      ? (mutation.error.response?.data as { detail?: string } | undefined)?.detail ??
        mutation.error.message
      : null
  const errorMessage = localError ?? apiError
  const success = mutation.isSuccess

  return (
    <div className="flex flex-col gap-6" data-testid="page-settings">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <SectionCard title={t('settings.account')} icon={UserCircleIcon}>
            <StatRow
              label={t('settings.fullName')}
              value={me.data?.fullName ?? me.data?.email ?? '—'}
            />
            <StatRow label={t('settings.role')} value={t('shell.role')} />
            <StatRow label={t('settings.email')} value={me.data?.email ?? '—'} />
          </SectionCard>

          <SectionCard title={t('settings.preferences')} icon={GearIcon}>
            <div className="flex items-center justify-between border-b py-2.5 text-sm last:border-b-0">
              <span className="text-muted-foreground">{t('settings.language')}</span>
              <LanguageSwitcher />
            </div>
          </SectionCard>
        </div>

        <SectionCard title={t('settings.changePassword')} icon={LockKeyIcon}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('settings.currentPassword')}</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('settings.newPassword')}</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('settings.confirmPassword')}</label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-risk-high" role="alert">
                {errorMessage}
              </p>
            )}
            {success && (
              <p className="text-sm text-risk-low" role="status">
                {t('settings.passwordChanged')}
              </p>
            )}

            <Button
              type="submit"
              className="self-start"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? t('common.loading')
                : t('settings.changePasswordButton')}
            </Button>
          </form>
        </SectionCard>
      </div>
    </div>
  )
}
