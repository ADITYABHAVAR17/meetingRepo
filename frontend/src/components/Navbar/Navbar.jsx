import React from 'react';

const Navbar = ({ toggleChat }) => {
  return (
    <div className="bg-blue-500 text-white flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">Video Chat App</h1>
      <button
        onClick={toggleChat}
        className="bg-white text-blue-500 px-4 py-2 rounded-lg"
      >
        Chat
      </button>
    </div>
  );
};

export default Navbar;
