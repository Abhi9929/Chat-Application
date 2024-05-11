export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser?._id ? users[1] : users[0].name;
};

export const isSameSenderMargin = (messages, msg, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === msg.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  // resciever messages on the right side
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== msg.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  // logged-in user messages on the left side
  else return 'auto';
};

export const isSameSender = (messages, msg, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== msg.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, msg, i) => {
  if (i === 0) return messages[i]?.sender._id === msg.sender._id;
  else return i > 0 && messages[i - 1]?.sender._id === msg.sender._id;
};
