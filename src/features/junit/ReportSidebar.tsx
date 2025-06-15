import type { ChangeEvent } from 'react'
import ModernInputFile from '@/components/ModernInputFile'
import ModernButton from '@/components/ModernButton'
import type { TestResult } from '@/parsePlaywrightJUnit'

interface Report {
  name: string
  tests: TestResult[]
}

interface Props {
  reports: Report[]
  selected: number | null
  onSelect: (idx: number) => void
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}

/**
 * レポート選択とファイル読み込みを行うサイドバー
 */
export default function ReportSidebar({ reports, selected, onSelect, onFileChange }: Props) {
  return (
    <aside className="w-full space-y-4 lg:w-1/4">
      <ModernInputFile multiple accept="application/xml" onChange={onFileChange} />
      <ul className="space-y-2">
        {reports.map((r, idx) => (
          <li key={idx}>
            <ModernButton
              className={`w-full text-left ${selected === idx ? 'bg-blue-600' : ''}`}
              onClick={() => onSelect(idx)}
            >
              {r.name}
            </ModernButton>
          </li>
        ))}
      </ul>
    </aside>
  )
}
