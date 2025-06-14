import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { TestResult, JUnitResult } from '@/parsePlaywrightJUnit'
import { parsePlaywrightJUnit } from '@/parsePlaywrightJUnit'

type Filter = 'all' | 'passed' | 'failed'

// JUnit の結果を表示するコンポーネント
export default function JTestReport() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [openDetails, setOpenDetails] = useState<number | null>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const result = parsePlaywrightJUnit(text) as JUnitResult
      setTests(result.tests)
    } catch (err) {
      console.error(err)
      alert('Invalid JUnit file')
      setTests([])
    }
  }

  const filteredTests = tests.filter((t: TestResult) => {
    if (filter === 'all') return true
    return filter === 'passed' ? t.status === 'passed' : t.status === 'failed'
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">JUnit レポート</h1>
      <div className="flex justify-center gap-4 mb-4">
        <input
          type="file"
          accept="application/xml"
          onChange={handleFileChange}
          className="p-2 bg-neutral-900 border border-gray-600 rounded"
        />
        {tests.length > 0 && (
          <label>
            フィルター:
            <select
              value={filter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFilter(e.target.value as Filter)
              }
            >
              <option value="all">すべて</option>
              <option value="passed">成功</option>
              <option value="failed">失敗</option>
            </select>
          </label>
        )}
      </div>
      {tests.length > 0 && (
        <table className="mx-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">テスト名</th>
              <th className="border p-2">結果</th>
              <th className="border p-2">詳細</th>
            </tr>
          </thead>
            <tbody>
              {filteredTests.map((test: TestResult, idx: number) => (
                <tr key={idx} className="even:bg-gray-50 dark:even:bg-white/5">
                  <td className="border p-2">{test.name}</td>
                  <td className="border p-2">{test.status}</td>
                  <td className="border p-2">
                    <button
                      className="px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
                      onClick={() =>
                        setOpenDetails(openDetails === idx ? null : idx)
                      }
                    >
                      {openDetails === idx ? '非表示' : '表示'}
                    </button>
                    {openDetails === idx && (
                      <pre className="text-left mt-2">{test.details || ''}</pre>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
    </div>
  )
}
