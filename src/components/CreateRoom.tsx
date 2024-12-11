
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createRoom, getAllRooms, joinRoom } from '../services/room.services';
import { Room } from '../types/user.types';
import { useNavigate } from 'react-router-dom';
import { RingLoader } from 'react-spinners';

interface RoomSearchForm {
  roomName: string;
  accessKey: string;
}

interface CreateRoomForm {
  roomName: string;
  accessKey: string;
}

const CreateRoom = () => {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<Room[] | null>(null);
  const [visibility, setVisibility] = useState<string>("hidden")
  const navigate = useNavigate();
  const [isloding, setIsloading] = useState<boolean>(false);
  const [islodingJoin, setIsloadingJoin] = useState<boolean>(false);


  useEffect(() => {
    (async function () {
      const response = await getAllRooms();
      setRooms(response)
      console.log(response)
    })()
  }, [])


  const { register: registerSearch, handleSubmit: handleSearchSubmit } = useForm<RoomSearchForm>();
  const { register: registerCreate, handleSubmit: handleCreateSubmit } = useForm<CreateRoomForm>();

  const onSearchSubmit: SubmitHandler<RoomSearchForm> = async (data) => {
    data.roomName = searchQuery as string;
    setIsloadingJoin(true);
    await joinRoom(data);
    setIsloadingJoin(false);
    navigate('/room')
  };

  const onCreateRoomSubmit: SubmitHandler<CreateRoomForm> = async (data) => {
    console.log('Creating room:', data.roomName, 'with access key:', data.accessKey);
    try {
      setIsloading(true);
      await createRoom(data);
      setIsloading(false);
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    if (!rooms) return;
    const filteredRooms = rooms.filter((room) =>
      room.roomName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRooms(filteredRooms)
    console.log(filteredRooms)
  }, [searchQuery])


  const joinRoomName = async (roomName: string) => {
    setVisibility("visible")
    setSearchQuery(roomName)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8 rounded-3xl shadow-xl bg-gray-50 mt-12 flex flex-col lg:flex-row justify-center gap-12">
      <div className="flex-1 flex flex-col gap-6 p-8 bg-white rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Search for a Room</h2>

        <form onSubmit={handleSearchSubmit(onSearchSubmit)} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Search for a room"
            value={searchQuery}
            onChange={(e) => {
              e.preventDefault();
              setSearchQuery(e.target.value)
            }}
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className={`flex flex-col gap-6 ${visibility}`}>
            <input
              type="text"
              placeholder="Enter access key"
              className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              {...registerSearch('accessKey', { required: true })}
            />
            <button
              type="submit"
              className="flex justify-center items-center w-full px-6 py-3 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-xl shadow-xl transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {islodingJoin ? (
                <RingLoader
                  color="white"
                  size={19}
                />
              ) : ("Join Room")}
            </button>
          </div>
        </form>

        <div className="w-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Available Rooms</h3>
          <ul className="space-y-2">
            {filteredRooms === null ? (
              <p className="text-gray-500">No rooms found.</p>
            ) : (
              filteredRooms.map((room, index) => (
                <li
                  key={index}
                  className="px-6 py-3 border-2 border-gray-200 rounded-lg shadow-sm hover:bg-blue-100 transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    joinRoomName(room.roomName)
                  }}
                >
                  {room.roomName}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center text-3xl font-bold text-gray-600">
        <span className="text-xl text-gray-500">OR</span>
      </div>

      <div className="flex-1 flex flex-col gap-6 p-8 bg-white rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Create a Room</h2>

        <form onSubmit={handleCreateSubmit(onCreateRoomSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter room name"
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            {...registerCreate('roomName', { required: true })}
          />
          <input
            type="text"
            placeholder="Enter access key"
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            {...registerCreate('accessKey', { required: true })}
          />
          <button
            type="submit"
            className="flex justify-center items-center w-full px-6 py-3 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-xl shadow-xl transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {isloding ? (
              <RingLoader
                color="white"
                size={19}
              />
            ) : ("Create Room")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
