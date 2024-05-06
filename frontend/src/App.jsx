import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
function App() {
  return (
    <div className='bg-green-400 h-screen w-full'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chats' element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
