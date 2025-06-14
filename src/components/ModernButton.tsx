import type { ButtonHTMLAttributes } from 'react'

/**
 * モダンなボタンコンポーネント
 */
export default function ModernButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition-transform ${className}`}
    />
  )
}
