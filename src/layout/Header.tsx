import type { ReactNode } from 'react'

/**
 * 共通ヘッダーコンポーネント
 */
export default function Header({ children }: { children: ReactNode }) {
  return (
    <header className="bg-blue-600 text-white p-4 text-xl text-center font-bold">
      {children}
    </header>
  )
}
