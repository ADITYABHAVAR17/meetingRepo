import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RoomCreatedPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(`http://localhost:3000/room/${roomId}`);
    alert('Room link copied to clipboard!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Room Created</h1>
      <p>Room ID: {roomId}</p>
      <button
        onClick={copyLinkToClipboard}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
      >
        Copy Room Link
      </button>
      <button
        onClick={() => navigate(`/room/${roomId}`)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
      >
        Join Room
      </button>
    </div>
  );
};

export default RoomCreatedPage;
