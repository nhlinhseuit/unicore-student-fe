import React from "react";
import SmallAvatar from "../courses/SmallAvatar";

interface Props {
  textAvatar: string;
  name: string;
}

const MyAccount = (params: Props) => {
  return (
    <div className="flex pl-2 gap-4 ">
      <SmallAvatar text={params.textAvatar} />
      <div>
        <p className="small-regular">{params.name}</p>
      </div>
    </div>
  );
};

export default MyAccount;
