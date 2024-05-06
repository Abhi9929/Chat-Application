/* eslint-disable react/prop-types */
import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';

function UserBadgeItem({user, handleFunction}) {
  return (
      <Box className='w-fit flex gap-1 items-center bg-green-400 p-1 px-2 rounded-full'>
        <Text>{user.name}</Text>
          <but onClick={handleFunction}>
            <ClearIcon fontSize='6px' />
        </but>
      </Box>
  );
}

export default UserBadgeItem;
