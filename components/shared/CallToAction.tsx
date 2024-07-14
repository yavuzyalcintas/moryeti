import { SignInButton, SignUpButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "../ui/button";

function CallToAction() {
  return (
    <div className="fixed bottom-0 z-10 flex h-60 w-full justify-center rounded-t-lg bg-primary-900/[99%] px-10 py-5 text-light-1 ">
      <div className="flex flex-col gap-2 md:w-3/4">
        <p className=" text-heading2-bold">Join Us!</p>
        <p className=" text-body-semibold">
          Dive into the conversation and be a part of our anonymous community
          now!
        </p>
        <div className="flex flex-row gap-5 mt-5">
          <SignUpButton mode="modal">
            <Button className="w-[200px] text-body-bold">Sign Up</Button>
          </SignUpButton>

          <SignInButton mode="modal">
            <Button variant="outline" className="w-[200px] text-body-bold">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}

export default CallToAction;
