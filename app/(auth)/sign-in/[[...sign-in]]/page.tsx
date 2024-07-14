import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        layout: { privacyPageUrl: "/privacy", termsPageUrl: "/terms" },
      }}
    />
  );
}
