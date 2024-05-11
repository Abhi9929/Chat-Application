import { Box, Button, useStatStyles } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import ChatBox from '../components/miscellaneous/ChatBox';
import MyChats from '../components/miscellaneous/MyChats';
import { ChatState } from '../Context/ChatProvider';

export default function Chat() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {}, [user]);

  return (
    <div className='w-full'>
      {user && <SideDrawer />}

      <Box className='flex justify-between w-full h-[91.5vh] p-3'>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
}
