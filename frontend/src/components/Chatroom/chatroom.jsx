import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from '../Navbar/Navbar';
import VideoControls from '../video/VideoControls'; // Import Video Controls

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!showChat) return;

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('joinRoom', { roomId, userName });

    newSocket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on('userJoined', ({ userName }) => {
      setMessages((prev) => [...prev, { userName: 'System', message: `${userName} joined the room.` }]);
    });

    newSocket.on('userLeft', ({ userName }) => {
      setMessages((prev) => [...prev, { userName: 'System', message: `${userName} left the room.` }]);
    });

    return () => newSocket.disconnect();
  }, [showChat, roomId, userName]);

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('chatMessage', { roomId, userName, message });
      setMessage('');
    }
  };

  const toggleChat = () => setShowChat(!showChat);

  const handleUserNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowChat(true);
    }
  };

  if (!showChat) {
    return (
      <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleUserNameSubmit} className="text-center">
          <input
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border rounded-lg px-4 py-2 mb-4"
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg">
            Join Chat
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Navbar toggleChat={toggleChat} />
      <div className="flex">
        {showChat && (
          <div className="w-1/3 border-r p-4">
            <h2 className="text-xl font-bold mb-4">Chat</h2>
            <div className="flex flex-col h-96 overflow-y-auto mb-4">
              {messages.map((msg, idx) => (
                <div key={idx} className="bg-gray-200 p-2 rounded mb-2">
                  <strong>{msg.userName}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full mb-2"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg w-full"
            >
              Send
            </button>
          </div>
        )}
        <div className={`p-4 ${showChat ? 'w-2/3' : 'w-full'}`}>
          <h2 className="text-xl font-bold mb-4">Video</h2>
          <VideoControls /> {/* Render Video Controls */}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;
