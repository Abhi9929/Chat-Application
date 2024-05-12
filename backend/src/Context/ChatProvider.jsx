import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage?.getItem('token'));

    const userInfo = JSON.parse(localStorage?.getItem('userInfo'));
    setUser(userInfo);

    if (!token || !userInfo) navigate('/');
    else navigate('/chats');
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const ChatState = () => {
  return useContext(ChatContext);
};

export { ChatProvider, ChatState };
