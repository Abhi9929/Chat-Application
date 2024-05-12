/* eslint-disable react/prop-types */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
  Spinner,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../userAvatar/UserList';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import { conf } from '../../config/config';
import { useDebounce } from '../../hooks/DebounceSearch';

function GroupChatModel({ children }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const debouncedSearch = useDebounce(search, 500);

  const { user, chats, setChats } = ChatState();

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const res = await axios.post(
        `${conf.BACKEND_URI}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
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
      console.log(data);
      setChats([data, ...chats]);
      onClose();
      toast({
        title: 'New Group Chat Created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    handleSearch();
  }, [debouncedSearch, search]);


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
        position: 'bottom-left',
      });
    }
  };

  // console.log(selectedUsers);
  const handleGroup = async (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    // console.log(selectedUsers);
  };

  const handleDelete = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u !== user));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='text-2xl felx justify-center'>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className='flex flex-col items-center'>
            <FormControl>
              <Input
                placeholder='Chat Name'
                mb={3}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add Users eg: John, Kia, Lamar'
                mb={1}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearch();
                }}
              />
            </FormControl>
            {/* selected users  */}
            <Box className='flex mb-3 justify-start items-start flex-wrap gap-2'>
              {selectedUsers?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
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
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModel;
