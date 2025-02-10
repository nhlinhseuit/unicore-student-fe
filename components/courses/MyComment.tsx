import React, { useState } from "react";
import { Input } from "../ui/input";
import SmallAvatar from "./SmallAvatar";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { createPostComment } from "@/services/commentsServices";

interface Props {
  textAvatar: string;
  type: string;
  sourceId: string;
  onComplete?: (cmt: string) => void;
}

const MyComment = (params: Props) => {
  const [inputValue, setInputValue] = useState<string>("");

  const mockParamsCreatorName =  "Nguyễn Hoàng Linh"
  const mockParamsCreatorEmail =  "21522289@gm.uit.edu.vn"

  const onSendComment = (inputValue: string) => {
    const data = {
      "content": inputValue,
      "source_id": params.sourceId,
      "creator_name": mockParamsCreatorName,
      "creator_email": mockParamsCreatorEmail
    }

    switch (params.type) {
      case "post":
        createPostComment(data).then(data => {
          console.log('createPostComment', data)
        })
        return;
      case "exercise":
        return;
      case "report":
        return;
      default:
        return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Cập nhật giá trị của input
  };

  const handleSendClick = () => {
    if (inputValue.trim()) {
      onSendComment(inputValue); // Gọi hàm từ props
      setInputValue(""); // Xóa giá trị sau khi gửi

      params.onComplete && params.onComplete(inputValue)
    } else {
      toast({
        title: `Vui lòng nhập nội dung bình luận!.`,
        variant: "error",
        duration: 3000,
      });
    }
  };

  return (
    <div className="pl-2 flex items-center gap-4">
      <SmallAvatar text={params.textAvatar} bgColor={"bg-[#DA3B01]"} />
      <div className="w-full border-b-[1px] relative flex items-center">
        <Input
          type="text"
          placeholder="Bình luận"
          value={inputValue}
          onChange={handleInputChange}
          className="
            w-full paragraph-regular no-focus placeholder
            shadow-none outline-none border-none truncate pr-10"
        />
        <Image
          src={"/assets/icons/send.png"}
          width={16}
          height={16}
          alt={"send"}
          className={`absolute right-0 top-1/2 -translate-y-1/2
            object-contain cursor-pointer hover:opacity-80`}
          onClick={handleSendClick}
        />
      </div>
    </div>
  );
};

export default MyComment;
