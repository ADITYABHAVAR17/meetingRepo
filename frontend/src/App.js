import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Homepage from "./Pages/HomePage/Homepage";


import ChatRoomPage from "./components/Chatroom/chatroom";
import HomePage from "./Pages/HomePage/Homepage";
import RoomCreatedPage from "./components/Roompage/RoomPage";





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room-created/:roomId" element={<RoomCreatedPage />} />
        <Route path="/room/:roomId" element={<ChatRoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;
