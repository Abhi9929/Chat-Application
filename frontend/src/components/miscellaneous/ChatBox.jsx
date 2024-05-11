/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from '../SingleChat';

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{
        base: selectedChat ? 'flex' : 'none',
        md: 'flex',
      }}
      alignItems={'center'}
      flexDirection={'column'}
      bg={'white'}
      p={3}
      w={{ base: '100%', md: '66%' }}
      borderRadius={'lg'}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default ChatBox