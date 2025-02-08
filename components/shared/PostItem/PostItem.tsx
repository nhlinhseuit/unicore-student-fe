import React, { useState } from "react";
import Image from "next/image";
import RenderFile from "../Annoucements/RenderFile";
import MyAvatar from "../../courses/MyAvatar";
import OtherComment from "../../courses/OtherComment";
import MyComment from "../../courses/MyComment";
import Divider from "../Divider";
import { getAvatarName } from "@/lib/utils";
import StatusButton from "../Button/StatusButton";
import parse from "html-react-parser";
import { fetchComments } from "@/services/commentsServices";

interface Comment {
  id: string;
  author: string;
  content: string;
}

interface Props {
  id: string;
  creator: string;
  createdAt: string;
  title: string;
  desc: string;
  fileName: string;
}

const PostItem = (params: Props) => {
  const [isViewComments, setIsViewComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([])

  const fetchViewComments = () => {
    fetchComments(params.id).then(data => {
      console.log('data fetchComments', data)
    })
  }

  return (
    <div className="card-wrapper rounded-[10px]">
      <div className="relative flex-col w-full p-6">
        <div className="flex justify-start items-center gap-2">
          <MyAvatar text={params.creator} />
          <p className="body-regular">{params.creator}</p>
          <p className="small-regular italic text-[#636363] line-clamp-1 ">
            - {params.createdAt}
          </p>
          <StatusButton
            temp
            text="Thông báo"
            smallText
            otherClasses="rounded-md ml-4"
          />
          {/* <Image
            src={"/assets/icons/edit-black.svg"}
            width={26}
            height={26}
            alt={"edit"}
            className={`object-contain cursor-pointer ml-4`}
          /> */}
        </div>

        <p className="base-regular mt-3 ml-2 ">{params.title}</p>
        <p className="body-regular mt-2 ml-2 ">{parse(params.desc)}</p>

        {/* //! KHI NÀO CÓ NỘP FILE  */}
        {/* <RenderFile _id={1} name={"exercise.docx"} otherClasses={"mt-3 px-2"} /> */}

        <Divider />

        {isViewComments && comments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {comments.map((item, index) => (
              <p>
                <OtherComment
                  key={item.id}
                  textAvatar={getAvatarName(item.author)}
                  name={item.author}
                  comment={item.content}
                />
                <Divider />
              </p>
            ))}
          </div>
        ) : (
          <p
            onClick={() => {
              setIsViewComments(true);
              fetchViewComments()
            }}
            className="flex justify-end underline cursor-pointer body-regular text-gray-500 mt-3 ml-2"
          >
            3 bình luận
            {/* {params.commentsCount} bình luận */}
          </p>
        )}

        <MyComment textAvatar="HL" type="post" sourceId={params.id} />
      </div>
    </div>
  );
};

export default PostItem;
