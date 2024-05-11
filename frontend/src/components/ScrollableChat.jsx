/* eslint-disable react/prop-types */
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../config/ChatLogic';
import { ChatState } from '../Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';

function ScrollableChat({ messages }) {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((msg, i) => (
          <div className='flex' key={msg._id}>
            {/* -- important logic --- */}
            {(isSameSender(messages, msg, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={msg.sender.name} placement='bottom' hasArrow>
                <Avatar
                  mt='8px'
                  mr={1}
                  size='sm'
                  cursor='pointer'
                  name={msg?.sender?.name}
                  src={msg?.sender?.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  msg.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'
                }`,
                marginLeft: isSameSenderMargin(messages, msg, i, user._id),
                marginTop: isSameUser(messages, msg, i, user._id) ? 3 : 10,
                borderRadius: '20px',
                // borderTopLeftRadius: isSameUser(messages, msg, i, user._id)
                //   ? '20px'
                //   : '0',
                // borderTopRightRadius: isSameUser(messages, msg, i, user._id)
                //   ? '0'
                //   : '20px',
                // borderBottomRightRadius: '20px',
                // borderBottomLeftRadius: '20px',
                padding: '5px 12px',
                maxWidth: '75%',
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
