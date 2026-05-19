import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthLayout } from './AuthLayout'
import { PasswordInput } from './PasswordInput'

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    localStorage.setItem('drivescore.token', 'mock-token')
    navigate('/')
  }

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
        <div className="mb-6">
          <PasswordInput id="confirm" required value={confirm} onChange={setConfirm} />
        </div>

        <Button type="submit" className="w-full">
          {t('register.submit')}
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
