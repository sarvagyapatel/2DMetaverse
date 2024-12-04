// import { useForm } from "react-hook-form";
// import { Room } from "../types/user.types";
// import { createRoom } from "../services/room.services";

// function CreateRoom() {
//     const { register, handleSubmit } = useForm<Room>();

//     const onSubmit = async (data: Room) => {
//         try {
//             const response = await createRoom(data);
//             console.log(response)
//         } catch (err) {
//             console.log(err)
//         }
//     };

//     return (
//         <div className="w-full max-w-md mx-auto p-16 rounded-3xl shadow-2xl bg-white text-gray-800 mt-8">
//             <h2 className="text-2xl font-bold text-center text-black">
//                 Create Your Custom Room
//             </h2>
//             <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
//                 <input
//                     placeholder="Enter room name"
//                     type="roomName"
//                     className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
//                     {...register("roomName", {
//                         required: true,
//                     })}
//                 />
//                 <input
//                     placeholder="Create access key"
//                     type="accessKey"
//                     className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
//                     {...register("accessKey", { required: true })}
//                 />
//                 <button
//                     type="submit"
//                     className="w-full px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 >
//                     Create Room
//                 </button>
//             </form>
//         </div>
//     )
// }

// export default CreateRoom


import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// Define types for form data
interface RoomSearchForm {
  roomSearch: string;
}

interface CreateRoomForm {
  roomName: string;
  accessKey: string;
}

const CreateRoom = () => {
  const [rooms] = useState([
    // Example rooms list
    { name: 'Room 1', accessKey: '123' },
    { name: 'Room 2', accessKey: '456' },
    { name: 'Room 3', accessKey: '789' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  // Use react-hook-form hooks with types
  const { register: registerSearch, handleSubmit: handleSearchSubmit } = useForm<RoomSearchForm>();
  const { register: registerCreate, handleSubmit: handleCreateSubmit } = useForm<CreateRoomForm>();

  // Handle Search Submit
  const onSearchSubmit: SubmitHandler<RoomSearchForm> = (data) => {
    setSearchQuery(data.roomSearch);
  };

  // Handle Create Room Submit
  const onCreateRoomSubmit: SubmitHandler<CreateRoomForm> = (data) => {
    // Handle room creation logic (e.g., API call)
    console.log('Creating room:', data.roomName, 'with access key:', data.accessKey);
  };

  // Filter rooms based on the search query
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-8 rounded-3xl shadow-xl bg-gray-50 mt-12 flex flex-col lg:flex-row justify-center gap-12">
      {/* Left side: Search Room */}
      <div className="flex-1 flex flex-col gap-6 p-8 bg-white rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Search for a Room</h2>
        
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit(onSearchSubmit)} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Search for a room"
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            {...registerSearch('roomSearch', { required: true })}
          />
          <button
            type="submit"
            className="w-full px-6 py-3 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-xl shadow-xl transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Search
          </button>
        </form>

        {/* Available Rooms */}
        <div className="w-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Available Rooms</h3>
          <ul className="space-y-2">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
                <li
                  key={index}
                  className="px-6 py-3 border-2 border-gray-200 rounded-lg shadow-sm hover:bg-blue-100 transition-all"
                >
                  {room.name} (Access Key: {room.accessKey})
                </li>
              ))
            ) : (
              <p className="text-gray-500">No rooms found.</p>
            )}
          </ul>
        </div>
      </div>

      {/* OR separator */}
      <div className="flex items-center justify-center text-3xl font-bold text-gray-600">
        <span className="text-xl text-gray-500">OR</span>
      </div>

      {/* Right side: Create Room */}
      <div className="flex-1 flex flex-col gap-6 p-8 bg-white rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Create a Room</h2>

        {/* Create Room Form */}
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
            className="w-full px-6 py-3 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-xl shadow-xl transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
