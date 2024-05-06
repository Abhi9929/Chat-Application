import mongoose, { Schema } from 'mongoose';
const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export { Message };
