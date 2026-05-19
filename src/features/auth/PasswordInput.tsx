import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  id?: string
  required?: boolean
}

export function PasswordInput({ value, onChange, id, required }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
      />
      <button
        type="button"
        aria-label="toggle password visibility"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
      </button>
    </div>
  )
}
