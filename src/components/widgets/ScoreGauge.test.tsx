import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScoreGauge } from './ScoreGauge'

describe('ScoreGauge', () => {
  it('renders the rounded score', () => {
    render(<ScoreGauge score={87.6} />)
    expect(screen.getByText('88')).toBeInTheDocument()
  })

  it('clamps an out-of-range score', () => {
    render(<ScoreGauge score={140} />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })
})
