import type { ChangeEvent } from 'react'
import ModernSelect from '@/components/ModernSelect'
import ModernTable from '@/components/ModernTable'
import type { TestResult } from '@/parsePlaywrightJUnit'

export type Filter = 'all' | 'passed' | 'failed'

interface Props {
  tests: TestResult[]
  filter: Filter
  onFilterChange: (value: Filter) => void
  selectedIndex: number | null
  onSelect: (idx: number) => void
}

/**
 * テスト一覧とフィルター表示
 */
export default function TestList({ tests, filter, onFilterChange, selectedIndex, onSelect }: Props) {
  const filtered = tests.filter(t => {
    if (filter === 'all') return true
    return filter === 'passed' ? t.status === 'passed' : t.status === 'failed' || t.status === 'error'
  })
  if (tests.length === 0) return null
  return (
    <>
      <div>
        <label className="mr-2">フィルター:</label>
        <ModernSelect
          value={filter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onFilterChange(e.target.value as Filter)}
        >
          <option value="all">すべて</option>
          <option value="passed">成功</option>
          <option value="failed">失敗</option>
        </ModernSelect>
      </div>
      <ModernTable
        columns={[
          { key: 'name', header: 'テスト名' },
          { key: 'status', header: '結果' }
        ]}
        data={filtered.map(t => ({ name: t.name, status: t.status }))}
        selectedIndex={selectedIndex}
        onRowClick={onSelect}
      />
    </>
  )
}
