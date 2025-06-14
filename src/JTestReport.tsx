import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { TestResult, JUnitResult } from '@/parsePlaywrightJUnit'
import { parsePlaywrightJUnit } from '@/parsePlaywrightJUnit'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

/**
 * 単一のテストファイルから得られた情報
 */
interface Report {
  name: string
  tests: TestResult[]
}

type Filter = 'all' | 'passed' | 'failed'

/**
 * JUnit XML を複数読み込み表示するコンポーネント
 */
export default function JTestReport() {
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

  const currentTests =
    selectedReport !== null ? reports[selectedReport].tests : []

  const filteredTests = currentTests.filter(t => {
    if (filter === 'all') return true
    return filter === 'passed' ? t.status === 'passed' : t.status === 'failed'
  })

  const chartData = reports.map((r, idx) => {
    let passed = 0
    let failed = 0
    r.tests.forEach(t => {
      if (t.status === 'passed') passed += 1
      else if (t.status === 'failed') failed += 1
    })
    return { name: `#${idx + 1}`, passed, failed }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">JUnit レポート</h1>
      {reports.length > 0 && (
        <div className="w-full h-48 mb-4">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="passed" fill="#4ade80" name="成功" />
              <Bar dataKey="failed" fill="#f87171" name="失敗" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="flex gap-4">
        <aside className="w-1/4 space-y-2">
          <input
            type="file"
            multiple
            accept="application/xml"
            onChange={handleFileChange}
            className="w-full p-2 bg-neutral-900 border border-gray-600 rounded"
          />
          <ul className="space-y-1">
            {reports.map((r, idx) => (
              <li key={idx}>
                <button
                  onClick={() => {
                    setSelectedReport(idx)
                    setSelectedTest(null)
                  }}
                  className={`w-full text-left px-2 py-1 rounded ${
                    selectedReport === idx
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="w-2/4 overflow-auto">
          {currentTests.length > 0 && (
            <>
              <div className="mb-2">
                <label>
                  フィルター:
                  <select
                    value={filter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFilter(e.target.value as Filter)
                    }
                    className="ml-1 border rounded"
                  >
                    <option value="all">すべて</option>
                    <option value="passed">成功</option>
                    <option value="failed">失敗</option>
                  </select>
                </label>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">テスト名</th>
                    <th className="border p-2">結果</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map((test, idx) => (
                    <tr
                      key={idx}
                      className={`cursor-pointer even:bg-gray-50 dark:even:bg-white/5 ${
                        selectedTest === idx ? 'bg-blue-100 dark:bg-blue-900' : ''
                      }`}
                      onClick={() => setSelectedTest(idx)}
                    >
                      <td className="border p-2">{test.name}</td>
                      <td className="border p-2">{test.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </main>
        <div className="w-1/4">
          {selectedTest !== null && filteredTests[selectedTest] && (
            <pre className="whitespace-pre-wrap border p-2 rounded bg-gray-50 dark:bg-gray-800">
              {filteredTests[selectedTest].details || '詳細なし'}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
