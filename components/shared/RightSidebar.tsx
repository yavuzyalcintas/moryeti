import { currentUser } from "@clerk/nextjs";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">New Joiners</h3>
        <div className="mt-7 flex w-[350px] flex-col gap-10"></div>
      </div>
    </section>
  );
}

export default RightSidebar;
