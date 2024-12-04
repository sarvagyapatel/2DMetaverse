import { Outlet } from "react-router-dom"

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className="h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
        <div className='w-full h-full flex justify-center items-center'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default App