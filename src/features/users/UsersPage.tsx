import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  ShieldCheckIcon,
  UserPlusIcon,
  ArrowsClockwiseIcon,
  CopyIcon,
  CheckIcon,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionCard } from '@/components/widgets/SectionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createUser } from '@/api/users.api'
import { useUsers } from '@/api/hooks/useUsers'
import { generatePassword } from '@/lib/generatePassword'
import type { User } from '@/api/auth.api'

function joinName(firstName: string, lastName: string): string | undefined {
  const joined = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
  return joined || undefined
}

export default function UsersPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const usersQuery = useUsers()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'manager'>('manager')
  const [copied, setCopied] = useState(false)

  const createMutation = useMutation({
    mutationFn: () =>
      createUser({
        email,
        password,
        fullName: joinName(firstName, lastName),
        role,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setRole('manager')
      setCopied(false)
    },
  })

  function handleGenerate() {
    setPassword(generatePassword())
    setCopied(false)
  }

  async function handleCopy() {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    createMutation.mutate()
  }

  const apiError =
    createMutation.error && axios.isAxiosError(createMutation.error)
      ? (createMutation.error.response?.data as { detail?: string } | undefined)
          ?.detail ?? createMutation.error.message
      : null

  return (
    <div className="flex flex-col gap-6" data-testid="page-users">
      <PageHeader title={t('users.title')} subtitle={t('users.subtitle')} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Create user form */}
        <SectionCard
          title={t('users.create')}
          icon={UserPlusIcon}
          className="lg:col-span-1"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">{t('users.firstName')}</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">{t('users.lastName')}</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('users.email')}</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('users.password')}</label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  required
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={createMutation.isPending}
                  className="font-mono"
                />
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-secondary"
                  title={t('users.generate')}
                  aria-label={t('users.generate')}
                  disabled={createMutation.isPending}
                >
                  <ArrowsClockwiseIcon size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-secondary"
                  title={t('users.copy')}
                  aria-label={t('users.copy')}
                  disabled={!password || createMutation.isPending}
                >
                  {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('users.passwordHint')}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('users.role')}</label>
              <div className="inline-flex rounded-lg border p-0.5">
                {(['manager', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={
                      'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ' +
                      (role === r
                        ? 'bg-slate text-slate-foreground'
                        : 'text-muted-foreground hover:bg-secondary')
                    }
                    disabled={createMutation.isPending}
                  >
                    {t(`users.role_${r}`)}
                  </button>
                ))}
              </div>
            </div>

            {apiError && (
              <p className="text-sm text-risk-high" role="alert">
                {apiError}
              </p>
            )}
            {createMutation.isSuccess && (
              <p className="text-sm text-risk-low" role="status">
                {t('users.created')}
              </p>
            )}

            <Button
              type="submit"
              className="self-start"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? t('common.loading') : t('users.submit')}
            </Button>
          </form>
        </SectionCard>

        {/* User list */}
        <SectionCard
          title={t('users.existing')}
          icon={ShieldCheckIcon}
          className="lg:col-span-2"
        >
          {usersQuery.isLoading && (
            <p className="text-muted-foreground">{t('common.loading')}</p>
          )}
          {usersQuery.error && (
            <p className="text-risk-high">{t('common.error')}</p>
          )}
          {usersQuery.data && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 font-semibold">{t('users.name')}</th>
                    <th className="pb-3 font-semibold">{t('users.email')}</th>
                    <th className="pb-3 text-right font-semibold">{t('users.role')}</th>
                  </tr>
                </thead>
                <tbody>
                  {usersQuery.data.map((u: User) => (
                    <tr key={u.id} className="border-b last:border-b-0">
                      <td className="py-3 font-medium">
                        {u.fullName || '—'}
                      </td>
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {u.email}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={
                            'rounded-full px-2.5 py-0.5 text-xs font-semibold ' +
                            (u.role === 'admin'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground')
                          }
                        >
                          {t(`users.role_${u.role}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
