import type { ReactNode } from 'react'

/** 行データの型 */
export interface ModernTableRow {
  [key: string]: ReactNode
}

interface Column {
  key: string
  header: string
}

interface Props {
  columns: Column[]
  data: ModernTableRow[]
  selectedIndex?: number | null
  onRowClick?: (index: number) => void
}

/**
 * モダンな表コンポーネント
 */
export default function ModernTable({ columns, data, selectedIndex = null, onRowClick }: Props) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} className="border p-2 bg-gray-100 text-left">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            className={`cursor-pointer even:bg-gray-50 hover:bg-blue-50 ${selectedIndex === idx ? 'bg-blue-100' : ''}`}
            onClick={() => onRowClick && onRowClick(idx)}
          >
            {columns.map(col => (
              <td key={col.key} className="border p-2">
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
