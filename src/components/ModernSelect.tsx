import type { SelectHTMLAttributes } from 'react'

/**
 * モダンなセレクトボックス
 */
export default function ModernSelect({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`rounded border border-gray-300 px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${className}`}
    />
  )
}
