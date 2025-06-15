import Header from '@/layout/Header'
import JUnitReport from '@/features/junit/JUnitReport'

// アプリケーション全体を構成するコンポーネント
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header>JUnit ビューア</Header>
      <main className="flex-1 p-8">
        <div className="max-w-[1280px] mx-auto">
          <JUnitReport />
        </div>
      </main>
    </div>
  )
}

export default App
