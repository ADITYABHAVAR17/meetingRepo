import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!roomName || !userName) return alert('Both fields are required.');
    try {
      const response = await axios.post('http://localhost:5000/api/rooms', { roomName, userName });
      const { roomId } = response.data;
      navigate(`/room-created/${roomId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Create a Room</h1>
      <input
        type="text"
        placeholder="Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="border rounded-lg px-4 py-2 mb-2 w-80"
      />
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="border rounded-lg px-4 py-2 mb-4 w-80"
      />
      <button
        onClick={handleCreateRoom}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        Create Room
      </button>
    </div>
  );
};

export default HomePage;
