import React from "react";

interface Props {
  unread: number;
}

const UnreadContainer = (params: Props) => {
  return (
    <div
      className="
        bg-red-500 
        text-white
        subtle-medium
        w-4
        h-4
        rounded-full
        flex
        justify-center
        items-center
        absolute
        top-0
        right-0
        translate-x-[50%]
        translate-y-[-30%]"
    >
      {params.unread}
    </div>
  );
};

export default UnreadContainer;
