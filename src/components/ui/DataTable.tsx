import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Pagination } from './Pagination'
import { cn } from '@/utils/cn'

export type SortDirection = 'asc' | 'desc' | null

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  searchable?: boolean
  searchPlaceholder?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  onRowClick,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Filtrar datos
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [data, searchTerm, searchable])

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  // Paginar datos
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (columnKey: keyof T | string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortColumn(null)
        setSortDirection(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (columnKey: keyof T | string) => {
    if (sortColumn !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-text-secondary" />
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4 text-accent-active" />
    }
    return <ArrowDown className="w-4 h-4 text-accent-active" />
  }

  return (
    <div className="bg-background-secondary border border-accent rounded-md">
      {searchable && (
        <div className="p-4 border-b border-accent">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full px-3 py-2 bg-background-primary border border-accent rounded-md text-text-primary text-sm focus:outline-none focus:border-accent-active"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent bg-background-primary">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-text-primary',
                    column.sortable && 'cursor-pointer hover:bg-background-secondary select-none'
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-text-secondary"
                >
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    'border-b border-accent hover:bg-background-primary transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3 text-sm text-text-primary">
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-accent">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            total={sortedData.length}
            limit={pageSize}
          />
        </div>
      )}

      <div className="px-4 py-2 border-t border-accent text-xs text-text-secondary">
        Mostrando {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
        {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length} registros
      </div>
    </div>
  )
}

