import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Data {
  name: string
  passed: number
  failed: number
}

/**
 * JUnit レポートのサマリーグラフを表示する
 */
export default function ReportChart({ data }: { data: Data[] }) {
  if (data.length === 0) return null
  return (
    <div className="w-full h-48 mb-4">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="passed" stackId="total" fill="#4ade80" name="成功" />
          <Bar dataKey="failed" stackId="total" fill="#f87171" name="失敗" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
