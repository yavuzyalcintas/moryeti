import { formatDateString, formatThreadContent } from "@/lib/utils";
import React from "react";
import Avatar from "../shared/Avatar";
import { Button } from "../ui/button";

import Image from "next/image";
import Link from "next/link";

interface PublicThreadCardProps {
  id: string;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
    username: string;
  };
  createdAt: string;
  firstReplyContent: string;
}

function PublicThreadCard({
  id,
  author,
  content,
  createdAt,
  firstReplyContent,
}: PublicThreadCardProps) {
  return (
    <article className="flex w-full flex-col rounded-xl bg-dark-2 p-7">
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Avatar variant="owner" author={author} className="relative" />

            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/@${author.username}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}{" "}
                <span className=" text-[13px] text-light-4/50">
                  @{author.username}
                </span>
              </h4>
            </Link>

            <span className=" text-subtle-semibold text-light-3/50">
              {formatDateString(createdAt)}
            </span>

            <div
              className={
                "mt-2 border-l-4 border-primary-500 pl-2 text-body1-bold text-light-2"
              }
            >
              {formatThreadContent(content, 500)}
            </div>

            <p className="mt-4 inline-flex gap-1 text-small-regular text-light-2">
              {formatThreadContent(firstReplyContent, 500)}
            </p>

            <div className="mt-1 flex flex-col gap-3">
              <div className="flex flex-row items-center justify-between">
                <div className="flex gap-3.5">
                  <Link href={`/thread/${id}`}>
                    <Button
                      variant="link"
                      className=" flex flex-row items-center gap-[2px] pl-0 text-[12px]"
                    >
                      Reply
                      <Image
                        src="/assets/reply.svg"
                        alt="reply"
                        width={24}
                        height={24}
                        className="cursor-pointer object-contain"
                      />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PublicThreadCard;
