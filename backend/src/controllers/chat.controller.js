import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Chat } from '../models/chat.model.js';
import { User } from '../models/user.model.js';
import { Message } from '../models/message.model.js';

// route responsible for creating and fetching one-o-one chat
const accessChat = asyncHandler(async (req, res) => {
  // userId of other user
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, 'UserId param not sent with request');
  }

  // If the Chat already exists with this user
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');
  // gethering info for latestMessage
  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  });

  // if the chat exists already
  if (isChat.length > 0) {
    res.status(200).send(isChat[0]);
  }
  // otherwise create a new chat
  else {
    let chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );

      return res.json(new ApiResponse(200, FullChat));
    } catch (error) {
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 }) // sorting from New to Old wrt `updatedAt`
    .then(async (results) => {
      // console.log('results: ', results);
      results = await User.populate(results, {
        path: 'latestMessage.sender',
        select: 'name pic email',
      });

      return res.send(new ApiResponse(200, results));
    })
    .catch((err) => {
      throw new ApiError(400, 'error occurs', err);
    });
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    throw new ApiError(400, 'Please Fill all the fields');
  }
  // parsing the users array
  const users = JSON.parse(req.body.users);

  // Adding loggedin user
  users.push(req.user);

  if (users.length < 2) {
    throw new ApiError(400, 'Add atleast 3 members to create a group');
  }

  const groupChat = await Chat.create({
    chatName: req.body.name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user,
  });
  if (!groupChat) {
    throw new ApiError(400, 'error occurs while creating group');
  }

  // fetch group chat from db
  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  return res.send(new ApiResponse(200, fullGroupChat, 'full group chat'));
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    throw new ApiError(400, 'error while updating Group name!');
  }

  res.send(
    new ApiResponse(200, updatedChat, 'group name updated successfully')
  );
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    throw new ApiError(400, 'error while adding to group!');
  }

  res.send(new ApiResponse(200, added, 'user added successfully'));
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    throw new ApiError(400, 'error while adding to group!');
  }

  res.send(new ApiResponse(200, removed, 'user removed successfully'));
});

/*
const deleteMessage = asyncHandler(async (req, res) => {
  let messageId = req.params?.messageId;
  messageId = messageId.replace(':', '');
  await Message.findByIdAndDelete(messageId);

  const userId = req.user._id;

  const remainingMessage = await Message.find({
    $and: [
      {
        sender: userId,
      },
      {
        receiver: req.body.receiverId,
      },
    ],
  });

  if (!remainingMessage) {
    throw new ApiError(401, 'Error occurs while fetching todos');
  }

  return res.json(new ApiResponse(200, remainingMessage, 'Remaining Messages'));
});
*/

export {
  accessChat,
  createGroupChat,
  fetchChats,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
