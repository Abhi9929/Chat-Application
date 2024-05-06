import { Box, Button } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { ChatState } from '../../../backend/src/Context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import ChatBox from '../components/miscellaneous/ChatBox';
import MyChats from '../components/miscellaneous/MyChats';

export default function Chat() {
  const { user } = ChatState();

  useEffect(() => {  
  }, [user])

  return (
    <div className='w-full'>
      {user && <SideDrawer />}

      <Box className='flex justify-between w-full h-[91.5vh] p-3'>
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}
