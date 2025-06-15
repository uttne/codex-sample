import Header from '@/layout/Header'
import Main from '@/layout/Main'
import JUnitReport from '@/contents/junit/JUnitReport'

// アプリケーション全体を構成するコンポーネント
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header>JUnit ビューア</Header>
      <Main>
        <JUnitReport />
      </Main>
    </div>
  )
}

export default App
