import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from "axios";
import { conf } from '../../config/config';

function Login() {
  const toast = useToast();
  const navigate = useNavigate();  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage?.getItem('token'));
    if (token) navigate('/chats');
  }, []);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please Fill the Fileds!',
        status: 'warning',
        duration: '3000',
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${conf.BACKEND_URI}/api/users/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toast({
        title: 'Welcome',
        status: 'success',
        duration: '3000',
        isClosable: true,
        position: 'bottom',
      });

      const { token, user } = data.data;
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('userInfo', JSON.stringify(user));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: '3000',
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };

  return (
    <VStack spacing={'3'}>
      <FormControl id='my_email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter your email'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id='my_password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            pr='4.5rem'
            type={show ? 'text' : 'password'}
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>{' '}
      </FormControl>
      <Button
        colorScheme='blue'
        className='w-full mt-3'
        onClick={submitHandler}
      >
        Login
      </Button>
    </VStack>
  );
}

export default Login;
