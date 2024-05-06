import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useDisclosure,
  List,
  ListItem,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ChatState } from '../../../../backend/src/Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLaoding from './ChatLaoding';
import UserListItem from '../userAvatar/UserList';

function SideDrawer() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/');
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: '3000',
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/users/search?s=${search}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem('token')
            )}`,
          },
        }
      );
      setSearchResult(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: '3000',
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const accesschat = async (userId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `http://localhost:8000/api/chat`,
        {
          userId,
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
      console.log(data.data);
      // if there is a new chat then it will append it in the existing chat
      if (!chats.find((c) => c._id === data.data._id)) {
        setChats([data.data, ...chats]);
      }
      setSelectedChat(data.data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
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

  return (
    <>
      {/* ---------------- Navbar --------------- */}
      <Box className='flex justify-between border-4 px-2 py-1 bg-[#eee] border-slate-300 rounded'>
        <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
          <Button variant={'ghost'} onClick={onOpen}>
            <SearchIcon />
            <Text className='hidden md:flex px-4'>Search User</Text>
          </Button>
        </Tooltip>

        <Text className='text-2xl'>Talk-A-Tive</Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationsIcon fontSize='small' className='m-1' />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<KeyboardArrowDownIcon />}>
              <Avatar size={'sm'} name={user?.name} src={user?.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* -------------- Drawer --------------- */}
      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent position={'relative'}>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            
          <Box className='flex gap-2 px-2'>
            <Input
              placeholder='Type here...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button colorScheme='blue' onClick={handleSearch}>
              Go
            </Button>
          </Box>

          <Box className='mt-5 px-2'>
            {loading ? (
              <ChatLaoding />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accesschat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={'auto'} display={'flex'} />}
          </Box>
    </DrawerBody>

          <DrawerFooter position={'absolute'} bottom={1} right={-5}>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
