"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import { clamp } from "@/lib/utils";
import { NotifContext, NotifContextType } from "@/context/notification-context";
import { useContext } from "react";

function Bottombar() {
  const { notifCount } = useContext(NotifContext) as NotifContextType;
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link relative  ${
                isActive ? "bg-primary-500" : "bg-primary-500/20"
              }`}
            >
              {link.route === "/notification" && notifCount > 0 && (
                <span className=" text-bold absolute -right-3 -top-1 h-6 w-6 rounded-full bg-primary-600/95 text-center text-light-1">
                  {clamp(notifCount, 0, 99)}
                </span>
              )}
              <Image
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className="object-contain"
              />

              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
