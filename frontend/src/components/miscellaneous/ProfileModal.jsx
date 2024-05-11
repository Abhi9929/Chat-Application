/* eslint-disable react/prop-types */
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import React from 'react';

function ProfileModal({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // console.log(user);
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton className='' icon={<RemoveRedEyeIcon />} onClick={onOpen} />
      )}
      <Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='text-5xl text-center'>
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className='flex justify-center items-center flex-col'>
            <Image src={user?.pic} borderRadius={'full'} boxSize={'170px'} alt={user?.name} />
            <Text marginTop={3} fontSize={'x-large'}>
              {user?.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal;
