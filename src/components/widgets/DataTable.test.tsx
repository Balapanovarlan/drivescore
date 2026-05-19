import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DataTable, type Column } from './DataTable'

interface Row {
  name: string
  score: number
}

const data: Row[] = [
  { name: 'C', score: 30 },
  { name: 'A', score: 90 },
  { name: 'B', score: 60 },
]

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', render: (r) => r.name, sortValue: (r) => r.name },
  { key: 'score', header: 'Score', render: (r) => r.score, sortValue: (r) => r.score },
]

describe('DataTable', () => {
  it('renders every row', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getAllByTestId('datatable-row')).toHaveLength(3)
  })

  it('sorts ascending then descending when a header is clicked', () => {
    render(<DataTable columns={columns} data={data} />)
    fireEvent.click(screen.getByText('Score'))
    let rows = screen.getAllByTestId('datatable-row')
    expect(rows[0].textContent).toContain('C') // score 30 first
    fireEvent.click(screen.getByText('Score'))
    rows = screen.getAllByTestId('datatable-row')
    expect(rows[0].textContent).toContain('A') // score 90 first
  })

  it('limits rows to the page size', () => {
    const many: Row[] = Array.from({ length: 25 }, (_, i) => ({
      name: `D${i}`,
      score: i,
    }))
    render(<DataTable columns={columns} data={many} pageSize={10} />)
    expect(screen.getAllByTestId('datatable-row')).toHaveLength(10)
  })
})
