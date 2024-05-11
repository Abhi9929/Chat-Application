import ConnectDB from './db/index.js';
import app from './app.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config();

ConnectDB()
  .then(() => {
    const PORT = process.env.PORT || 8001;
    const HOST = process.env.HOST || 'localhost';
    const server = app.listen(PORT, () => {
      console.log(`⚙️  Server is listening on port :${PORT}`);
    });
    const io = new Server(server, {
      pingTimeout: 6000,
      cors: {
        origin: ['http://localhost:5173'],
      },
    });

    io.on('connection', (socket) => {
      console.log('connected to socket.io');

      socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
      });
      socket.on('join chat', (room) => {
        socket.join(room);
        console.log('user joined room: ', room);
      });

      socket.on('typing', (room) => socket.in(room).emit('typing'));
      socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

      socket.on('new message', (newMessageRecieved) => {
        // console.log(newMessageRecieved);
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;

          // console.log('what the issue');
          socket.in(user._id).emit('message recieved', newMessageRecieved);
        });
      });

      socket.off('setup', () => {
        console.log('USER DISSCONNECTED');
        socket.leave(userData._id);
      })
    });

  })
  .catch((err) => {
    console.log('Error Occurs: ', err);
  });

