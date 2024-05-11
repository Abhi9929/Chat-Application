import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Chat } from '../models/chat.model.js';
import { User } from '../models/user.model.js';
import { Message } from '../models/message.model.js';

// route responsible for creating and fetching one-o-one chat
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId || !content) {
    throw new ApiError(400, 'Invalid data passed into request');
  }

  let newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });
    // console.log('Message: ', message);
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    return res.send(new ApiResponse(201, message, 'message send'));
  } catch (error) {
    throw new ApiError(411, error.message);
  }
});
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId.replace(':', ''),
    })
      .populate('sender', 'name pic email')
      .populate('chat');

    res.send(new ApiResponse(200, messages, 'all messages'));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});
export { sendMessage, allMessages };
