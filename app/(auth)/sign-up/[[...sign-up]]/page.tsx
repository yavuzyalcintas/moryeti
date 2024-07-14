import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      appearance={{
        layout: { privacyPageUrl: "/privacy", termsPageUrl: "/terms" },
      }}
    />
  );
}
