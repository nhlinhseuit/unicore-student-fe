import React from "react";
import SmallAvatar from "../courses/SmallAvatar";

interface Props {
  textAvatar: string;
  name: string;
}

const getLastTwoWords = (name: string) => {
  const words = name.trim().split(" ");
  return words.slice(-2).join(" ");
};

const MyAccount = (params: Props) => {
  return (
    <div className="flex pl-2 gap-4 items-center">
      <SmallAvatar text={params.textAvatar} />
      <div>
        <p className="body-regular">{getLastTwoWords(params.name)}</p>
      </div>
    </div>
  );
};

export default MyAccount;
