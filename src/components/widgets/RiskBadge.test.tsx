import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@/i18n'
import { RiskBadge } from './RiskBadge'

describe('RiskBadge', () => {
  it('renders a localized risk label', () => {
    render(<RiskBadge category="high" />)
    // default language is ru => "Высокий риск"
    expect(screen.getByText(/риск|risk|тәуекел/i)).toBeInTheDocument()
  })
})
