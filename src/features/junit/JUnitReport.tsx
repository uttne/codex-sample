import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { TestResult, JUnitResult } from '@/parsePlaywrightJUnit'
import { parsePlaywrightJUnit } from '@/parsePlaywrightJUnit'
import ReportChart from '@/features/junit/ReportChart'
import ReportSidebar from '@/features/junit/ReportSidebar'
import TestList, { Filter } from '@/features/junit/TestList'
import TestDetails from '@/features/junit/TestDetails'

/**
 * 単一のテストファイルから得られた情報
 */
interface Report {
  name: string
  tests: TestResult[]
}

/**
 * JUnit XML を複数読み込み表示するコンポーネント
 */
export default function JUnitReport() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<number | null>(null)
  const [selectedTest, setSelectedTest] = useState<number | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  /**
   * ファイル選択時に複数 XML を読み込み配列に追加する
   */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const loaded: Report[] = []
    for (const file of Array.from(files)) {
      try {
        const text = await file.text()
        const result = parsePlaywrightJUnit(text) as JUnitResult
        loaded.push({ name: file.name, tests: result.tests })
      } catch (err) {
        console.error(err)
        alert(`Invalid JUnit file: ${file.name}`)
      }
    }
    if (loaded.length > 0) {
      setReports(prev => [...prev, ...loaded])
      if (selectedReport === null) setSelectedReport(0)
    }
    e.target.value = ''
  }

  const currentTests = selectedReport !== null ? reports[selectedReport].tests : []
  const chartData = reports.map((r, idx) => {
    let passed = 0
    let failed = 0
    r.tests.forEach(t => {
      if (t.status === 'passed') passed += 1
      else if (t.status === 'failed' || t.status === 'error') failed += 1
    })
    return { name: `#${idx + 1}`, passed, failed }
  })

  const selected =
    selectedTest !== null && currentTests[selectedTest]
      ? currentTests[selectedTest]
      : null

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">JUnit レポート</h1>
      <ReportChart data={chartData} />
      <div className="flex flex-col gap-6 lg:flex-row">
        <ReportSidebar
          reports={reports}
          selected={selectedReport}
          onSelect={idx => {
            setSelectedReport(idx)
            setSelectedTest(null)
          }}
          onFileChange={handleFileChange}
        />
        <main className="w-full space-y-2 overflow-auto lg:w-2/4">
          <TestList
            tests={currentTests}
            filter={filter}
            onFilterChange={setFilter}
            selectedIndex={selectedTest}
            onSelect={setSelectedTest}
          />
        </main>
        <div className="w-full lg:w-1/4">
          <TestDetails test={selected} />
        </div>
      </div>
    </div>
  )
}
