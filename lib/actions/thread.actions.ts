"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread, { ThreadStatus } from "../models/thread.model";
import { createNotification } from "./notification.actions";
import { NotificationType } from "../models/notifications.model";
import { formatThreadContent } from "../utils";
import BlockedUsers from "../models/blocked-users.model";

export async function fetchPosts(
  pageNumber = 1,
  pageSize = 20,
  userId?: string,
  onlyUserPosts?: boolean
) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  let filter = {};

  if (onlyUserPosts) {
    filter = {
      parentId: { $in: [null, undefined] },
      status: { $in: [ThreadStatus.Pending, ThreadStatus.Completed] },
      askerId: userId,
    };
  } else {
    filter = {
      parentId: { $in: [null, undefined] },
      status: ThreadStatus.Completed,
    };
  }

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Thread.find(filter)
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children", // Populate the children field
      populate: [
        {
          path: "author", // Populate the author field within children
          model: User,
          select: "_id name parentId image username", // Select only _id and username fields of the author
        },
        {
          path: "children", // Populate the children field within children
          model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
        },
      ],
    });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string;
  author: string;
  authorId: string;
  path: string;
  askerId: string;
}

export async function createThread({
  text,
  author,
  path,
  askerId,
  authorId,
}: Params) {
  try {
    connectToDB();

    const blockedUserIds = await BlockedUsers.find({ userId: authorId });
    if (blockedUserIds.map((w) => w.blockedUserId).includes(askerId)) {
      return;
    }

    const createdThread = await Thread.create({
      text,
      author,
      askerId,
      authorId,
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    const askerUser = await User.findOne({ id: askerId });

    await createNotification({
      userId: authorId,
      createdUserId: askerUser._id,
      type: NotificationType.NewQuestion,
      link: `/thread/${createdThread.id}`,
      content: formatThreadContent(text, 50),
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image username",
      }) // Populate the author field with _id and username
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image username", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

function getCommentNotificationType(
  ownerId: string,
  askerId: string,
  commentUserId: string
): NotificationType {
  if (ownerId === commentUserId) return NotificationType.OwnerQuestionReply;
  if (askerId === commentUserId) return NotificationType.AskerQuestionReply;

  return NotificationType.AnonQuestionReply;
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  author: string,
  path: string,
  authorId: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author,
      parentId: threadId,
      status: ThreadStatus.Completed,
      authorId,
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);
    originalThread.createdAt =
      originalThread.status === ThreadStatus.Pending
        ? Date.now()
        : originalThread.createdAt;
    originalThread.status = ThreadStatus.Completed;

    // Save the updated original thread to the database
    await originalThread.save();

    // Eğer anon ise iki bildirim, diğer türlü karşı tarafa bildirim at
    if (originalThread.authorId !== authorId) {
      await createNotification({
        userId: originalThread.authorId,
        createdUserId: author,
        type: getCommentNotificationType(
          originalThread.authorId,
          originalThread.askerId,
          authorId
        ),
        link: `/thread/${originalThread.id}`,
        content: formatThreadContent(commentText, 50),
      });
    }

    if (originalThread.askerId !== authorId) {
      await createNotification({
        userId: originalThread.askerId,
        createdUserId: author,
        type: getCommentNotificationType(
          originalThread.authorId,
          originalThread.askerId,
          authorId
        ),
        link: `/thread/${originalThread.id}`,
        content: formatThreadContent(commentText, 50),
      });
    }

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}
