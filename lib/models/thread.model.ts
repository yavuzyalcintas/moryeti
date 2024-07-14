/* eslint-disable no-unused-vars */
import mongoose from "mongoose";

export enum ThreadStatus {
  Pending = "pending",
  Completed = "completed",
}

const threadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  askerId: {
    type: String,
  },
  status: {
    type: String,
    default: ThreadStatus.Pending,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
