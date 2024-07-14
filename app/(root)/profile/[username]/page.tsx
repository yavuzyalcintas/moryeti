import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchUser } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";
import { ThreadStatus } from "@/lib/models/thread.model";

async function Page({ params }: { params: { username: string } }) {
  const authUser = await currentUser();

  const userInfo = await fetchUser("", params.username);
  if (authUser && !userInfo?.onboarded) redirect("/onboarding");

  const currentUserInfo = await fetchUser(authUser?.id);

  const isOwnerProfile = userInfo?.id === authUser?.id;

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
        isOwnerUser={isOwnerProfile}
        questionCount={
          userInfo.threads?.filter(
            // @ts-ignore
            (w) => w.status === ThreadStatus.Completed
          ).length
        }
        followerCount={0}
      />

      <div className="mt-9">
        {!isOwnerProfile && (
          <>
            <PostThread
              author={userInfo._id}
              askerId={authUser?.id}
              authorId={userInfo.id}
            />

            <ThreadsTab
              currentUserId={currentUserInfo?.id}
              currentUserObjectId={currentUserInfo?._id}
              accountId={userInfo.id}
              status={ThreadStatus.Completed}
            />
          </>
        )}

        {isOwnerProfile && (
          <Tabs defaultValue="1" className="w-full">
            <TabsList className="tab">
              <TabsTrigger key="completedThreads" value="1" className="tab">
                <Image
                  src="/assets/reply.svg"
                  alt="completedThreads"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="">Questions</p>
              </TabsTrigger>
              <TabsTrigger key="pendingThreads" value="2" className="tab">
                <p className="ml-1 rounded-full bg-primary-500 px-2 py-1 !text-tiny-medium text-light-2">
                  {
                    userInfo.threads.filter(
                      (w: { status: ThreadStatus }) =>
                        w.status === ThreadStatus.Pending
                    ).length
                  }
                </p>
                <p className="">Pending Questions</p>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              key={`content-completedThreads`}
              value="1"
              className="w-full text-light-1"
            >
              <ThreadsTab
                currentUserId={currentUserInfo.id}
                accountId={userInfo.id}
                status={ThreadStatus.Completed}
                currentUserObjectId={currentUserInfo._id}
              />
            </TabsContent>
            <TabsContent
              key={`content-pendingThreads`}
              value="2"
              className="w-full text-light-1"
            >
              <ThreadsTab
                currentUserId={currentUserInfo.id}
                accountId={userInfo.id}
                status={ThreadStatus.Pending}
                currentUserObjectId={currentUserInfo._id}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  );
}
export default Page;
