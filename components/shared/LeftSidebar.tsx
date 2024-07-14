"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn } from "@clerk/nextjs";

import { sidebarLinks } from "@/constants";
import { twMerge } from "tailwind-merge";
import { clamp } from "@/lib/utils";
import { NotifContext, NotifContextType } from "@/context/notification-context";
import { useContext } from "react";

const LeftSidebar = ({ username }: { username: string }) => {
  const { notifCount } = useContext(NotifContext) as NotifContextType;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/logo-only.png" alt="logo" width={72} height={72} />
          <span className="rounded-full bg-primary-500 px-2 py-1 text-base-semibold text-light-1">
            Beta
          </span>
        </Link>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === "/profile") link.route = `/@${username}`;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${
                isActive && "bg-primary-500 relative"
              }`}
            >
              {link.route === "/notification" && notifCount > 0 && (
                <span className=" absolute w-6 h-6 rounded-full text-light-1 bg-primary-600/95 text-bold right-0 top-2 text-center">
                  {clamp(notifCount, 0, 99)}
                </span>
              )}
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />

              <p
                className={twMerge(
                  "text-light-1 max-lg:hidden ",
                  !isActive && " hover:text-primary-500"
                )}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />

              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
