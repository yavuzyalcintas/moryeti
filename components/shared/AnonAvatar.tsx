import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

function AnonAvatar({ size, className }: { size: number; className?: string }) {
  return (
    <Image
      src="/assets/incognito.svg"
      alt="anonym avatar"
      width={size}
      height={size}
      className={twMerge(" rounded-full bg-primary-500 p-1", className)}
    />
  );
}

export default AnonAvatar;
