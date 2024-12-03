import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MetaverseCanvas from './components/MetaverseCanvas.tsx'
import LogIn from './components/LogIn.tsx'
import SignUp from './components/SignUp.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
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
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
)
