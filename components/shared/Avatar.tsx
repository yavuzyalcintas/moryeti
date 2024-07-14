import React from "react";
import Link from "next/link";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import AnonAvatar from "./AnonAvatar";

interface AvatarProps {
  variant?: "owner" | "asker" | "replier";
  author?: { username: string; image: string };
  className?: string;
}

function Avatar({ variant, author, className }: AvatarProps) {
  return (
    <>
      {variant === "owner" && author && (
        <Link
          href={`/@${author.username}`}
          className={twMerge("h-11 w-11", className)}
        >
          <Image
            src={author.image}
            alt="user_community_image"
            fill
            style={{ objectFit: "cover" }}
            className="cursor-pointer rounded-full"
          />
        </Link>
      )}
      {variant === "asker" && <AnonAvatar size={44} className="" />}
      {variant === "replier" && <AnonAvatar size={44} className=" bg-blue" />}
      {!variant && <AnonAvatar size={44} className=" bg-blue" />}
    </>
  );
}

export default Avatar;
