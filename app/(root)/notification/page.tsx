/* eslint-disable no-unreachable */
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchNotifications } from "@/lib/actions/notification.actions";
import { NotificationType } from "@/lib/models/notifications.model";
import Avatar from "@/components/shared/Avatar";
import { twMerge } from "tailwind-merge";

type Notification = {
  link?: string;
  userId: string;
  type: NotificationType;
  isRead: boolean;
  content?: string;
  createdUserId: {
    id: string;
    username: string;
    image: string;
    name: string;
  };
};

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user?.id || "");
  if (!userInfo?.onboarded) redirect("/onboarding");

  const notifications = (await fetchNotifications(
    userInfo.id
  )) as Notification[];

  function getAvatarVariant(notifType: NotificationType) {
    switch (notifType) {
      case NotificationType.OwnerQuestionReply:
        return "owner";

      case NotificationType.AnonQuestionReply:
        return "replier";

      case NotificationType.AskerQuestionReply:
        return "asker";

      case NotificationType.NewQuestion:
        return "asker";
    }
  }

  function getUserName(notifType: NotificationType, name: string) {
    switch (notifType) {
      case NotificationType.OwnerQuestionReply:
        return name;

      case NotificationType.AnonQuestionReply:
        return "Anonymous";

      case NotificationType.AskerQuestionReply:
        return "Questioner";

      case NotificationType.NewQuestion:
        return "Questioner";

      default:
        return "";
    }
  }

  function getContent(notifType: NotificationType, content?: string) {
    switch (notifType) {
      case NotificationType.OwnerQuestionReply:
        return " is replied your question.";

      case NotificationType.AnonQuestionReply:
        return " is replied your question.";

      case NotificationType.AskerQuestionReply:
        return " is replied your question.";

      case NotificationType.NewQuestion:
        return " asked you a new question!";
    }
  }

  return (
    <>
      <h1 className="head-text">Notifications</h1>

      <section className="mt-10 flex flex-col gap-5">
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification, idx) => (
              <Link key={idx} href={notification.link!}>
                <article
                  className={twMerge(
                    "activity-card rounded-2xl transition-colors hover:bg-dark-4 duration-200",
                    !notification.isRead &&
                      " border-l-8 border-primary-500 -ml-2 bg-dark-4"
                  )}
                >
                  {getAvatarVariant(notification.type) !== undefined && (
                    <Avatar
                      variant={getAvatarVariant(notification.type)!}
                      author={{
                        username: notification.createdUserId.username,
                        image: notification.createdUserId.image,
                      }}
                      className="relative"
                    />
                  )}
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {getUserName(
                        notification.type,
                        notification.createdUserId.name
                      )}
                    </span>
                    {getContent(notification.type, notification.content)}
                    {notification.content && (
                      <>
                        <br />
                        <span className=" text-light-4 italic">
                          {notification.content}...
                        </span>
                      </>
                    )}
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </>
  );
}

export default Page;
