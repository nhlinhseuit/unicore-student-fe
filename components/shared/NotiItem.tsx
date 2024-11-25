import React from "react";
import RenderFile from "./Annoucements/RenderFile";
import RenderTag from "./Annoucements/RenderTag";
import Image from "next/image";
import Link from "next/link";
import MoreButtonComponent from "./Table/components/MoreButtonComponent";

interface Props {
  _id: string;
  title: string;
  description: string;
  tags: {
    _id: string;
    name: string;
  }[];
  createdAt: String;
}

const NotiItem = ({ _id, title, description, tags, createdAt }: Props) => {
  return (
    <div className="relative flex w-full gap-12 py-2 px-2 hover:bg-gray-100 rounded-md cursor-pointer">
      {/* MORE */}
      <div className="z-50 cursor-pointer hover:bg-white absolute right-2 bg-transparent border border-gray-400 rounded-full p-2 w-[30px] h-[30px] flex justify-center items-center">
        <MoreButtonComponent handleEdit={() => { }} />
      </div>

      {/* IMAGE */}
      <div className="w-[10%]">
        <Image
          src="/assets/images/uit-icon.svg"
          width={30} // Đặt kích thước cố định
          height={30}
          alt="noti"
          layout="fixed"
          className="ml-3 w-full object-contain"
        />

      </div>

      {/* CONTENT */}
      <div className="w-[80%] flex items-start justify-between sm:flex-row">
        <div>
          <Link href={`/announcements/${_id}`}>
            <p className="normal-semibold text-[#1F86E8] line-clamp-1 underline flex-1">
              {title}
            </p>
          </Link>

          <span className="mt-2 small-regular italic text-[#636363] line-clamp-1 ">
            {createdAt}
          </span>

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
            ))}
          </div>

          <p className="flex-1 mt-2 body-regular text-dark200_light900 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotiItem;
