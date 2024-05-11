import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';
import messageRoute from './routes/message.route.js';
import { errorhandler, notFound } from './middlewares/errorHandling.middleware.js';

const app = express();



app.use(express.json());
app.use(express.static("public"))
app.use(cookieParser());
app.use(cors({origin: "*"}))

// routes
app.use('/api/users', userRoute);
app.use('/api/chat', chatRoute);
app.use('/api/message', messageRoute);

app.get('/', (req, res) => {

  
  return res.send('hello');
});

// Error handling middleware
app.use(notFound);
app.use(errorhandler);

export default app;
