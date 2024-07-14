import { SignedIn, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function Topbar() {
  return (
    <nav className="topbar visible md:invisible">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/logo-only.png" alt="logo" width={72} height={72} />
        <span className="rounded-full bg-primary-500 px-2 py-1 text-base-semibold text-light-1">
          Beta
        </span>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;
