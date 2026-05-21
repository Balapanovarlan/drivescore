import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { register, setToken } from '@/api/auth.api'
import { AuthLayout } from './AuthLayout'
import { PasswordInput } from './PasswordInput'

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => register({ email, password, fullName }),
    onSuccess: (data) => {
      setToken(data.token)
      navigate('/', { replace: true })
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLocalError(null)
    if (password !== confirm) {
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

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} data-testid="page-register">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('register.eyebrow')}
        </p>
        <h1 className="mb-6 mt-1 text-2xl font-bold">{t('register.heading')}</h1>

        <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
          {t('register.fullName')}
        </label>
        <Input
          id="fullName"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mb-4"
          disabled={mutation.isPending}
        />

        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          {t('register.email')}
        </label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
          disabled={mutation.isPending}
        />

        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          {t('register.password')}
        </label>
        <div className="mb-4">
          <PasswordInput id="password" required value={password} onChange={setPassword} />
        </div>

        <label htmlFor="confirm" className="mb-1 block text-sm font-medium">
          {t('register.confirmPassword')}
        </label>
        <div className="mb-2">
          <PasswordInput id="confirm" required value={confirm} onChange={setConfirm} />
        </div>

        {errorMessage && (
          <p className="mb-4 text-sm text-risk-high" role="alert">
            {errorMessage}
          </p>
        )}

        <Button type="submit" className="mt-4 w-full" disabled={mutation.isPending}>
          {mutation.isPending ? t('common.loading') : t('register.submit')}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('register.haveAccount')}{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t('register.loginLink')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
