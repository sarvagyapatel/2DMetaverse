import { Link } from 'react-router-dom'
import logo from '../assets/actor.png'
import { useEffect, useState } from 'react';
import { User } from '../types/user.types';
import { getCurrentUser } from '../services/auth.services';
import { RingLoader } from 'react-spinners';

function Home() {
  const [host, setHost] = useState<User | null>(null)

  const currentUser = async () => {
    const response = await getCurrentUser();
    console.log(response)
    setHost(response)
  }

  useEffect(() => {
    currentUser();
  }, [])
  return (
    <>
    {host===null?(
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center justify-center">
      <RingLoader
        color="white"
        size={(window.innerHeight) / 6}
        loading
      />
      <h1 className='text-2xl font-semibold text-white opacity-65'>Connecting to Server</h1>
    </div>
    )
     :(<div className='w-full max-w-md mx-auto p-9 rounded-3xl shadow-xl bg-white text-gray-800 mt-12 flex flex-col justify-center items-center gap-1'>
        <h1 className='text-3xl font-extrabold text-center text-gray-900 transition duration-300 transform hover:-translate-y-1'>
          Welcome to 2DMetaVerse
        </h1>
        <div className='w-64'>
          <img className='w-full h-auto object-contain rounded-xl transition duration-300 transform hover:-translate-y-1 ' src={logo} alt='logo' />
        </div>
        <div className='flex flex-col gap-4 w-full'>
          <Link to={host.id ? ('/createroom') : ('/login')}>
            <button className='w-full px-6 py-3 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600'>
              Connect to public lobby
            </button>
          </Link>

          <Link to={host.id ? ('/createroom') : ('/login')}>
            <button className='w-full px-6 py-3 text-blue-700 bg-white border-2 border-blue-700 hover:bg-blue-700 hover:text-white font-semibold rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600'>
              Create/find custom rooms
            </button>
          </Link>
        </div>
      </div>)
    }  
    </>
  )
}

export default Home