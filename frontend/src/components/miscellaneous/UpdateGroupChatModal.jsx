/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
  useDisclosure,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from '@chakra-ui/react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../userAvatar/UserList';
import { conf } from '../../config/config';
import { useDebounce } from '../../hooks/DebounceSearch';

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState();

  const toast = useToast();

  const debouncedSearch = useDebounce(search, 500);

  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    handleSearch();
  }, [debouncedSearch, search]);

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast({
        title: 'Only admins can remove someone',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${conf.BACKEND_URI}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
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
      // If the admin leaves the group
      userToRemove._id === user._id
        ? setSelectedChat('')
        : setSelectedChat(data);
      setLoading(false);
      setFetchAgain(!fetchAgain);
      // fetching all messages after removing someone from group.
      fetchMessages();
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error Occured!',
        description: error.response.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
    setGroupChatName('');
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    // checking for a group admin
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can change group name',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    try {
      setRenameloading(true);

      const res = await axios.put(
        `${conf.BACKEND_URI}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
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
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameloading(false);
    } catch (error) {
      setRenameloading(false);
      console.log(error);
      toast({
        title: 'Error Occured!',
        description: error.response.data?.message,
        status: 'error',
        duration: '3000',
        isClosable: true,
        position: 'bottom',
      });
    }
    setGroupChatName('');
  };

  const handleSearch = async () => {
    if (!debouncedSearch) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${conf.BACKEND_URI}/api/users/search?s=${debouncedSearch}`,
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
        position: 'bottom',
      });
    }
  };

  const handleAddUser = async (userToAdd) => {
    console.log(selectedChat);
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    // checking for a group admin
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    try {
      const res = await axios.put(
        `${conf.BACKEND_URI}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
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
      //   console.log(data);
      setSelectedChat(data);
    } catch (error) {
      //   console.log(error);
      toast({
        title: 'Error Occured!',
        description: error.response.data?.message || '',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
    setGroupChatName('');
  };

  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<RemoveRedEyeIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'} fontSize={'xx-large'}>
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className='flex gap-2 flex-wrap justify-center p-1 mb-2'>
              {selectedChat?.users?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display='flex'>
              <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant='solid'
                colorScheme='teal'
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add User to group'
                mb={1}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearch();
                }}
              />
            </FormControl>
            {/* render searched users */}
            {loading ? (
              <Spinner size={'lg'} />
            ) : (
              searchResult
                ?.slice(0, 3)
                ?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
