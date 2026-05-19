import { useMemo, useState, type ReactNode } from 'react'
import { CaretUpIcon, CaretDownIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
  align?: 'left' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  onRowClick?: (row: T) => void
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 20,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortValue) return data
    const sortValue = col.sortValue
    return [...data].sort((a, b) => {
      const av = sortValue(a)
      const bv = sortValue(b)
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [data, columns, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const rows = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize)

  function toggleSort(key: string, sortable: boolean) {
    if (!sortable) return
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  return (
    <div>
      <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => {
              const sortable = Boolean(col.sortValue)
              const active = sortKey === col.key
              return (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key, sortable)}
                  className={cn(
                    'border-b pb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground',
                    col.align === 'right' ? 'text-right' : 'text-left',
                    sortable && 'cursor-pointer select-none',
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {active &&
                      (sortDir === 'asc' ? (
                        <CaretUpIcon size={12} />
                      ) : (
                        <CaretDownIcon size={12} />
                      ))}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              data-testid="datatable-row"
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b last:border-b-0',
                onRowClick && 'cursor-pointer hover:bg-secondary',
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'py-3 text-sm',
                    col.align === 'right' ? 'text-right' : 'text-left',
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
            className="rounded-lg border px-3 py-1 disabled:opacity-40"
          >
            &larr;
          </button>
          <span className="font-mono tabular-nums text-muted-foreground">
            {safePage + 1} / {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage(safePage + 1)}
            className="rounded-lg border px-3 py-1 disabled:opacity-40"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
