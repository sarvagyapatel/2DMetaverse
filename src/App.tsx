import { Outlet } from "react-router-dom"

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Outlet />
    </div>
  )
}

export default App