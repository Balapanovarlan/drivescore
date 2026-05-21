import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login, setToken } from '@/api/auth.api'
import { formatDuration } from '@/lib/formatDuration'
import { AuthLayout } from './AuthLayout'
import { PasswordInput } from './PasswordInput'

interface LocationState {
  from?: string
}

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      setToken(data.token)
      const dest = (location.state as LocationState | null)?.from ?? '/'
      navigate(dest, { replace: true })
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    mutation.mutate()
  }

  function buildErrorMessage(): string | null {
    if (!mutation.error) return null
    if (!axios.isAxiosError(mutation.error)) return mutation.error.message
    const err = mutation.error

    // Network failure (no response from server)
    if (!err.response) return t('login.networkError')

    const status = err.response.status

    if (status === 429) {
      // Prefer the Retry-After header; fall back to scraping the seconds from `detail`.
      const headerValue = err.response.headers?.['retry-after']
      let seconds = headerValue ? Number(headerValue) : NaN
      if (!Number.isFinite(seconds)) {
        const detail = (err.response.data as { detail?: string } | undefined)?.detail ?? ''
        const match = detail.match(/(\d+)\s*s/)
        if (match) seconds = Number(match[1])
      }
      if (Number.isFinite(seconds) && seconds > 0) {
        return t('login.tooManyAttempts', { duration: formatDuration(seconds, t) })
      }
      return t('login.tooManyAttempts', { duration: '' }).trim()
    }

    if (status === 401) return t('login.invalidCredentials')

    return (
      (err.response.data as { detail?: string } | undefined)?.detail ?? err.message
    )
  }

  const errorMessage = buildErrorMessage()

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} data-testid="page-login">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('login.eyebrow')}
        </p>
        <h1 className="mb-6 mt-1 text-2xl font-bold">{t('login.heading')}</h1>

        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          {t('login.email')}
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
          {t('login.password')}
        </label>
        <div className="mb-2">
          <PasswordInput
            id="password"
            required
            value={password}
            onChange={setPassword}
          />
        </div>

        {errorMessage && (
          <p className="mb-4 text-sm text-risk-high" role="alert">
            {errorMessage}
          </p>
        )}

        <Button type="submit" className="mt-4 w-full" disabled={mutation.isPending}>
          {mutation.isPending ? t('common.loading') : t('login.submit')}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            {t('login.registerLink')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
