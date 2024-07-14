"use client";

import {
  newNotificationCount,
  readNotifications,
} from "@/lib/actions/notification.actions";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export type NotifContextType = {
  notifCount: number;
};

export const NotifContext = React.createContext<NotifContextType | null>(null);

const NotifProvider: React.FC<{
  userId?: string;
  children: React.ReactNode;
}> = ({ children, userId }) => {
  const pathname = usePathname();
  const [notifCount, setNotifCount] = React.useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const count = await newNotificationCount(userId);
      setNotifCount(count || 0);
    }, 15 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (pathname === "/notification" && userId) {
      setTimeout(async () => {
        await readNotifications(userId);
        setNotifCount(0);
      }, 5 * 1000);
    }
  }, [pathname]);

  return (
    <NotifContext.Provider value={{ notifCount }}>
      {children}
    </NotifContext.Provider>
  );
};

export default NotifProvider;
