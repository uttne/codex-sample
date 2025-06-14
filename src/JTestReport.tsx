import { useState } from 'react'
import type { ChangeEvent } from 'react'

interface TestResult {
  name: string
  status: string
  details?: string
}

interface JTestResult {
  tests: TestResult[]
}

type Filter = 'all' | 'passed' | 'failed'

export default function JTestReport() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [openDetails, setOpenDetails] = useState<number | null>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text) as JTestResult
      if (Array.isArray(data.tests)) {
        setTests(data.tests)
      } else {
        alert('Invalid JTest file')
        setTests([])
      }
    } catch (err) {
      console.error(err)
      alert('Invalid JTest file')
      setTests([])
    }
  }

  const filteredTests = tests.filter((t: TestResult) => {
    if (filter === 'all') return true
    return filter === 'passed' ? t.status === 'passed' : t.status === 'failed'
  })

  return (
    <div className="jtest-report">
      <h1>JTest レポート</h1>
      <div className="filter-bar">
        <input
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="file-input"
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
        <table className="test-table">
          <thead>
            <tr>
              <th>テスト名</th>
              <th>結果</th>
              <th>詳細</th>
            </tr>
          </thead>
            <tbody>
              {filteredTests.map((test: TestResult, idx: number) => (
                <tr key={idx}>
                  <td>{test.name}</td>
                  <td>{test.status}</td>
                  <td>
                    <button onClick={() => setOpenDetails(openDetails === idx ? null : idx)}>
                      {openDetails === idx ? '非表示' : '表示'}
                    </button>
                    {openDetails === idx && <pre>{test.details || ''}</pre>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
    </div>
  )
}
