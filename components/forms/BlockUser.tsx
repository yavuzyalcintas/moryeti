"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { blockUser } from "@/lib/actions/user.actions";

interface BlockUserProps {
  userId: string;
  blockingUserId: string;
  userObjectId: string;
}

function BlockUser({ blockingUserId, userId, userObjectId }: BlockUserProps) {
  const path = usePathname();
  const { toast } = useToast();

  if (blockingUserId === userId) return null;

  async function onBlockUser() {
    await blockUser({
      userId,
      blockedUserId: blockingUserId,
      userObjectId,
      path,
    });

    toast({
      title: "User Blocked!",
    });
  }

  return (
    <Button
      variant="link"
      className="flex h-5 flex-row gap-1 text-[14px]"
      onClick={() => onBlockUser()}
    >
      <Image
        src="/assets/block-user.svg"
        alt="block user"
        width={16}
        height={16}
        className=" object-contain"
      />
      Block User
    </Button>
  );
}

export default BlockUser;
