"use server";

import { connectToDB } from "../mongoose";

import { revalidatePath } from "next/cache";

import Notifications, { NotificationType } from "../models/notifications.model";
import User from "../models/user.model";

interface Params {
  content?: string;
  link?: string;
  userId: string;
  createdUserId: string;
  type: NotificationType;
}

export async function createNotification({
  content,
  createdUserId,
  link,
  type,
  userId,
}: Params) {
  try {
    connectToDB();

    await Notifications.create({
      content,
      createdUserId,
      link,
      type,
      userId,
    });
  } catch (error: any) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
}

export async function fetchNotifications(userId: string) {
  try {
    connectToDB();

    return await Notifications.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "createdUserId",
        model: User,
      });
  } catch (error: any) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
}

export async function newNotificationCount(userId?: string) {
  if (!userId) return;
  try {
    connectToDB();

    return await Notifications.countDocuments({ userId, isRead: false });
  } catch (error: any) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
}

export async function readNotifications(userId: string): Promise<void> {
  try {
    connectToDB();

    await Notifications.updateMany(
      { userId, isRead: false },
      {
        isRead: true,
      }
    );

    revalidatePath("/notification");
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
