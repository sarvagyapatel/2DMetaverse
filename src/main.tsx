import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MetaverseCanvas from './components/MetaverseCanvas.tsx'
import LogIn from './components/LogIn.tsx'
import SignUp from './components/SignUp.tsx'
import Home from './components/Home.tsx'
import CreateRoom from './components/CreateRoom.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/room',
        element: <MetaverseCanvas />
      },
      {
        path: '/login',
        element: <LogIn />
      },
      {
        path: '/signup',
        element: <SignUp />
      },
      {
        path: '/createroom',
        element: <CreateRoom />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
)
