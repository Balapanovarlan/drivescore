import { ListIcon } from '@phosphor-icons/react'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex items-center justify-between border-b bg-card px-4 py-3.5 sm:px-8">
      <button
        type="button"
        aria-label="Open navigation"
        onClick={onMenuClick}
        className="flex size-9 items-center justify-center rounded-lg border text-muted-foreground lg:hidden"
      >
        <ListIcon size={20} />
      </button>
      <div className="ml-auto">
        <LanguageSwitcher />
      </div>
    </header>
  )
}
