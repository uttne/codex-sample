import JTestReport from '@/JTestReport'

// アプリケーション全体を構成するコンポーネント
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 text-xl text-center font-bold">
        JUnit ビューア
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-[1280px] mx-auto">
          <JTestReport />
        </div>
      </main>
    </div>
  )
}

export default App
