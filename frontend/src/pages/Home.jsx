import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';

function Home() {
  return (
    <Container className='w-full h-full flex justify-center items-center'>
      <Container className='text-center'>
        <Stack spacing={'4'}>
          {/* <Box className='rounded-lg bg-white border'>
            <Text fontSize={'4xl'} className='text-black font-normal'>
              Memospark
            </Text>
          </Box> */}
          <Box className='bg-white w-full rounded-lg border p-2'>
            <Tabs variant='soft-rounded'>
              <TabList>
                <Tab width={'50%'}>Login</Tab>
                <Tab width={'50%'}>Signup</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Stack>
      </Container>
    </Container>
  );
}

export default Home;
