/* eslint-disable no-unused-vars */
import mongoose from "mongoose";

export enum NotificationType {
  Announcement = "announcement",
  NewQuestion = "newQuestion",
  AskerQuestionReply = "askerQuestionReply",
  AnonQuestionReply = "anonQuestionReply",
  OwnerQuestionReply = "ownerQuestionReply",
}

const notificationsSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  link: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  createdUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notifications =
  mongoose.models.Notifications ||
  mongoose.model("Notifications", notificationsSchema);

export default Notifications;
