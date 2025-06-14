import type { InputHTMLAttributes } from 'react'

/**
 * モダンなファイル選択コンポーネント
 */
export default function ModernInputFile({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="file"
      className={`w-full rounded border border-gray-300 px-3 py-2 text-gray-700 file:mr-3 file:rounded file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white hover:file:bg-blue-600 transition-colors ${className}`}
    />
  )
}
