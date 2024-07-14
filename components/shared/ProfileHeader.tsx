import Link from "next/link";
import Image from "next/image";

interface Props {
  accountId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  followerCount: number;
  questionCount: null;
  type?: string;
  isOwnerUser: boolean;
}

function ProfileHeader({
  accountId,
  name,
  username,
  imgUrl,
  bio,
  type,
  followerCount,
  questionCount,
  isOwnerUser,
}: Props) {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-secondary-500">@{username}</p>
          </div>
        </div>
        {isOwnerUser && (
          <Link href="/profile/edit">
            <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2">
              <Image
                src="/assets/edit.svg"
                alt="logout"
                width={16}
                height={16}
              />

              <p className="text-light-1 max-sm:hidden">Edit</p>
            </div>
          </Link>
        )}
        {/* {accountId !== authUserId && (
          <Button variant="outlineSecondary">Follow</Button>
        )} */}
      </div>

      <div className="mt-6 flex w-full flex-row items-center justify-between text-base-regular text-light-2">
        <div className=" w-full">{bio}</div>
        <div className=" flex flex-row gap-4 divide-x-[0.5px] divide-light-1/30">
          <div className="flex flex-row items-center gap-2">
            <span className=" text-heading3-bold text-light-1 ">
              {questionCount}
            </span>
            Questions
          </div>
          {/* <div className="flex flex-row items-center gap-2 pl-4">
            <span className=" text-heading3-bold text-light-1">
              {followerCount}
            </span>
            Followers
          </div> */}
        </div>
      </div>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
}

export default ProfileHeader;
