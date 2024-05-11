/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import ChatLoading from './ChatLaoding';
import { getSender } from '../../config/ChatLogic';
import GroupChatModel from './GroupChatModel';
import {conf} from '../../config/config'

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${conf.BACKEND_URI}/api/chat`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      });
      setChats(data.data);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error fetching the chat!',
        description: error.message,
        status: 'error',
        duration: '3000',
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));

    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      w={{ base: '100%', md: '33%' }}
      className='flex-col items-center p-2 bg-white rounded-lg'
    >
      <Box className='pb-3 px-2 text-base sm:text-xl flex w-full justify-between items-center gap-1'>
        My Chats
        <GroupChatModel fetchAgain={fetchAgain}>
          <Button
            d='flex'
            fontSize={{ base: '14px', md: '14px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>

      <Box className='flex flex-col p-3 bg-[#F8F8F8] w-full h-full rounded-lg overflow-y-hidden'>
        {chats ? (
          <Stack overflowY={'scroll'}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius='lg'
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize='xs'>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + '...'
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
