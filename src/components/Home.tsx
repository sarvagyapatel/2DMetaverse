import { Link } from 'react-router-dom'
import logo from '../assets/actor.png'

function Home() {
  return (
    <div className='w-full max-w-md mx-auto p-9 rounded-3xl shadow-xl bg-white text-gray-800 mt-12 flex flex-col justify-center items-center gap-1'>
      <h1 className='text-3xl font-extrabold text-center text-gray-900'>
        Welcome to 2DMetaVerse
      </h1>
      <div className='w-64'>
        <img className='w-full h-auto object-contain rounded-xl' src={logo} alt='logo' />
      </div>
      <div className='flex flex-col gap-4 w-full'>
        <Link to='/login'>
          <button className='w-full px-6 py-3 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600'>
            Connect to public lobby
          </button>
        </Link>

        <Link to='/signup'>
          <button className='w-full px-6 py-3 text-blue-700 bg-white border-2 border-blue-700 hover:bg-blue-700 hover:text-white font-semibold rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600'>
            Create/find custom rooms
          </button>
        </Link>
      </div>
    </div>

  )
}

export default Home