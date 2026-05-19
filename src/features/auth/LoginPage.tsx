import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthLayout } from './AuthLayout'
import { PasswordInput } from './PasswordInput'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    localStorage.setItem('drivescore.token', 'mock-token')
    navigate('/')
  }

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
        />

        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          {t('login.password')}
        </label>
        <div className="mb-6">
          <PasswordInput id="password" required value={password} onChange={setPassword} />
        </div>

        <Button type="submit" className="w-full">
          {t('login.submit')}
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
