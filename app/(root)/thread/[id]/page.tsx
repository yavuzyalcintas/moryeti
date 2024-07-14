import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import Comment from "@/components/forms/Comment";
import ThreadCard from "@/components/cards/ThreadCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchThreadById } from "@/lib/actions/thread.actions";

export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  function getUserType(id: any): "owner" | "asker" | "replier" | undefined {
    if (thread.author.id === id) return "owner";
    if (thread.askerId === id) return "asker";

    return "replier";
  }

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          createdAt={thread.createdAt}
          comments={thread.children}
          askerId={thread.askerId}
          currentUserObjectId={userInfo._id}
          firstReplyContent={thread.children[0]?.text}
        />
      </div>

      <div className=" flex flex-col gap-4">
        <Comment
          threadId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
          authorId={userInfo.id}
        />
        <div className=" text-small-medium text-light-4">
          <span className=" text-primary-500">*</span> Your profile is
          <b className="ml-1">Anonymous</b>!
        </div>
      </div>

      <div className="mt-10">
        {thread.children.slice(1).map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
            userType={getUserType(childItem.author.id)}
            askerId={childItem.askerId}
            currentUserObjectId={userInfo._id}
          />
        ))}
      </div>
    </section>
  );
}

export default page;
