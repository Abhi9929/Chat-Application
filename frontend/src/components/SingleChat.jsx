/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import '../assets/style.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';
import { conf } from '../config/config';

const ENDPOINT = conf.BACKEND_URI;
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderedSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // fetching all messages
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${conf.BACKEND_URI}/api/message/:${selectedChat._id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem('token')
            )}`,
          },
        }
      );
      const { data } = res.data;
      // console.log(data);
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error Occured!',
        description: 'Failed to sync chats',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
    }
    setLoading(false);
  };

  // sending new message
  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        setLoading(true);
        setNewMessage('');
        const res = await axios.post(
          `${conf.BACKEND_URI}/api/message/`,
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem('token')
              )}`,
            },
          }
        );
        const { data } = res.data;
        // console.log(data);
        setLoading(false);

        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error Occured!',
          description: 'Failed to send the message',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom',
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);


  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // give notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text className='pb-3 py-1 px-2 flex justify-between items-center w-full text-2xl md:text-3xl'>
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box className='flex flex-col p-3 bg-gray-300 w-full h-full rounded-lg overflow-y-hidden'>
            {loading ? (
              <Spinner
                size={'xl'}
                w={20}
                h={20}
                alignSelf={'center'}
                margin={'auto'}
              />
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <Lottie
                  options={defaultOptions}
                  height={60}
                  width={70}
                  style={{ marginBottom: 0, marginLeft: 0 }}
                />
              ) : (
                <></>
              )}
              <Input
                variant={'filled'}
                bg={'#E0E0E0'}
                placeholder='Enter a message...'
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box className='flex items-center justify-center h-full'>
          <Text className='text-3xl pb-3'>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
