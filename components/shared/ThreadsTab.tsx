import { redirect } from "next/navigation";

import { fetchUserPosts } from "@/lib/actions/user.actions";

import ThreadCard from "../cards/ThreadCard";
import { ThreadStatus } from "@/lib/models/thread.model";
import PublicThreadCard from "../cards/PublicThreadCard";

interface Result {
  name: string;
  image: string;
  id: string;
  username: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    askerId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    createdAt: string;
    children: {
      author: {
        image: string;
        id: string;
      };
      text: string;
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  currentUserObjectId: string;
  accountId: string;
  status: ThreadStatus;
}

async function ThreadsTab({
  currentUserId,
  accountId,
  status,
  currentUserObjectId,
}: Props) {
  const result: Result = await fetchUserPosts(accountId, status);

  const isPublicView = !currentUserId && !currentUserObjectId;

  if (!result) {
    redirect("/");
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {!isPublicView &&
        result.threads.map((thread) => (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={{
              name: result.name,
              image: result.image,
              id: result.id,
              username: result.username,
            }}
            createdAt={thread.createdAt}
            comments={thread.children}
            replyVisible={status === ThreadStatus.Pending}
            firstReplyContent={thread.children[0]?.text}
            viewMode="feed"
            askerId={thread.askerId}
            threadStatus={status}
            currentUserObjectId={currentUserObjectId}
          />
        ))}

      {isPublicView &&
        result.threads.map((thread) => (
          <PublicThreadCard
            key={thread._id}
            id={thread._id}
            content={thread.text}
            author={{
              name: result.name,
              image: result.image,
              id: result.id,
              username: result.username,
            }}
            createdAt={thread.createdAt}
            firstReplyContent={thread.children[0]?.text}
          />
        ))}
    </section>
  );
}

export default ThreadsTab;
