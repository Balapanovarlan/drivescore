import { ListIcon, QuestionIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

interface TopbarProps {
  onMenuClick: () => void
  onHelpClick?: () => void
}

export function Topbar({ onMenuClick, onHelpClick }: TopbarProps) {
  const { t } = useTranslation()
  return (
    <header className="flex items-center justify-between border-b bg-card px-4 py-3.5 sm:px-8">
      <button
        type="button"
        aria-label={t('shell.openNav')}
        onClick={onMenuClick}
        className="flex size-9 items-center justify-center rounded-lg border text-muted-foreground lg:hidden"
      >
        <ListIcon size={20} />
      </button>
      <div className="ml-auto flex items-center gap-2">
        {onHelpClick && (
          <button
            type="button"
            onClick={onHelpClick}
            aria-label={t('onboarding.openHelp')}
            title={t('onboarding.openHelp')}
            className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <QuestionIcon size={18} />
          </button>
        )}
        <LanguageSwitcher />
      </div>
    </header>
  )
}
