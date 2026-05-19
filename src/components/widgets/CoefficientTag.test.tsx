import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoefficientTag } from './CoefficientTag'

describe('CoefficientTag', () => {
  it('formats the coefficient with two decimals and a multiplier sign', () => {
    render(<CoefficientTag coefficient={1} />)
    expect(screen.getByText('1.00×')).toBeInTheDocument()
  })
})
