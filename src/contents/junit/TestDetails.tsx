import type { TestResult } from '@/parsePlaywrightJUnit'

/**
 * 選択されたテストの詳細を表示する
 */
export default function TestDetails({ test }: { test: TestResult | null }) {
  if (!test) return null
  return (
    <div className="space-y-2 border p-2 rounded bg-gray-50 dark:bg-gray-800">
      <p>
        <strong>結果:</strong> {test.status}
      </p>
      {test.classname && (
        <p>
          <strong>クラス:</strong> {test.classname}
        </p>
      )}
      {test.file && (
        <p>
          <strong>ファイル:</strong> {test.file}
          {test.line !== undefined && `:${test.line}`}
        </p>
      )}
      {test.time !== undefined && (
        <p>
          <strong>時間:</strong> {test.time}s
        </p>
      )}
      {test.assertions !== undefined && (
        <p>
          <strong>アサーション:</strong> {test.assertions}
        </p>
      )}
      {test.message && (
        <p>
          <strong>メッセージ:</strong> {test.message}
        </p>
      )}
      {test.type && (
        <p>
          <strong>タイプ:</strong> {test.type}
        </p>
      )}
      {test.details && <pre className="whitespace-pre-wrap">{test.details}</pre>}
      {test.systemOut && (
        <pre className="whitespace-pre-wrap">stdout: {test.systemOut}</pre>
      )}
      {test.systemErr && (
        <pre className="whitespace-pre-wrap">stderr: {test.systemErr}</pre>
      )}
      {test.properties && (
        <div>
          <strong>プロパティ:</strong>
          <ul className="ml-4 list-disc">
            {Object.entries(test.properties).map(([k, v]) => (
              <li key={k}>
                {k}: {v}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
