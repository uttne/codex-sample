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
      <h1>JTest \u30ec\u30dd\u30fc\u30c8</h1>
      <div className="filter-bar">
        <input
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="file-input"
        />
        {tests.length > 0 && (
          <label>
            \u30d5\u30a3\u30eb\u30bf\u30fc:
            <select
              value={filter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFilter(e.target.value as Filter)
              }
            >
              <option value="all">\u3059\u3079\u3066</option>
              <option value="passed">\u6210\u529f</option>
              <option value="failed">\u5931\u6557</option>
            </select>
          </label>
        )}
      </div>
      {tests.length > 0 && (
        <table className="test-table">
          <thead>
            <tr>
              <th>\u30c6\u30b9\u30c8\u540d</th>
              <th>\u7d50\u679c</th>
              <th>\u8a73\u7d30</th>
            </tr>
          </thead>
            <tbody>
              {filteredTests.map((test: TestResult, idx: number) => (
                <tr key={idx}>
                  <td>{test.name}</td>
                  <td>{test.status}</td>
                  <td>
                    <button onClick={() => setOpenDetails(openDetails === idx ? null : idx)}>
                      {openDetails === idx ? '\u975e\u8868\u793a' : '\u8868\u793a'}
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
