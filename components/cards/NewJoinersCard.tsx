import React from "react";
import Avatar from "../shared/Avatar";

type NewJoiner = {
  name: string;
  image: string;
  username: string;
};

interface NewJoinersCardProps {
  users: NewJoiner[];
}

async function NewJoinersCard({ users }: NewJoinersCardProps) {
  return (
    <ul
      className="mb-8 flex items-start justify-between space-x-3 overflow-x-scroll rounded py-4 drop-shadow-xl"
      style={{ scrollbarWidth: "none" }}
    >
      {users.map((user) => (
        <li
          className="flex h-[120px] w-[80px] flex-none flex-col items-center justify-center space-y-1 rounded-lg border-[1px] border-primary-800 p-4 text-center text-[12px] font-bold text-white  "
          key={user.username}
        >
          <Avatar
            author={{ image: user.image, username: user.username }}
            variant="owner"
            className=" relative"
          />
          {user.name}
        </li>
      ))}
    </ul>
  );
}

export default NewJoinersCard;
