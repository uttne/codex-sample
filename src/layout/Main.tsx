import type { ReactNode } from 'react'

/**
 * メインコンテンツ領域を提供するレイアウトコンポーネント
 */
export default function Main({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-[1280px] mx-auto">{children}</div>
    </main>
  )
}
