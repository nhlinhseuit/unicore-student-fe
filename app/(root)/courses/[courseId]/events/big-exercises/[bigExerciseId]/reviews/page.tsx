"use client";

import IconButton from "@/components/shared/Button/IconButton";
import ReviewExercisePostItem from "@/components/shared/PostItem/ReviewExercisePostItem";
import { mockReviewOptions } from "@/constants";
import { mockPostData } from "@/mocks";
import { Dropdown } from "flowbite-react";
import Image from "next/image";
import { useState } from "react";

const Reviews = () => {
  const [selectedReviewOption, setSelectedReviewOption] = useState(1);

  return (
    <div>
      <div className="mt-6 mb-6 flex justify-start ml-10 w-1/2 items-center gap-4">
        <p className="inline-flex justify-start text-sm whitespace-nowrap">
          Bộ lọc
        </p>
        <Dropdown
          className="z-30 rounded-lg"
          label=""
          dismissOnClick={true}
          renderTrigger={() => (
            <div>
              <IconButton
                text={`${
                  selectedReviewOption !== -1
                    ? mockReviewOptions[selectedReviewOption - 1].value
                    : "Chọn lớp"
                }`}
                onClick={() => {}}
                iconRight={"/assets/icons/chevron-down.svg"}
                bgColor="bg-white"
                textColor="text-black"
                border
              />
            </div>
          )}
        >
          <div className="scroll-container scroll-container-dropdown-content">
            {mockReviewOptions.map((course: any, index) => (
              <Dropdown.Item
                key={`${course}_${index}`}
                onClick={() => {
                  if (selectedReviewOption === course.id) {
                    setSelectedReviewOption(-1);
                  } else {
                    setSelectedReviewOption(course.id);
                  }
                }}
              >
                <div className="flex justify-between w-full gap-4">
                  <p className="text-left line-clamp-1">{course.value}</p>
                  {selectedReviewOption === course.id ? (
                    <Image
                      src="/assets/icons/check.svg"
                      alt="search"
                      width={21}
                      height={21}
                      className="cursor-pointer mr-2"
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </Dropdown.Item>
            ))}
          </div>
        </Dropdown>
      </div>

      {/* ExercisePostList */}
      <div className="mt-6 flex flex-col gap-4">
        {mockPostData.map((item, index) => (
          <ReviewExercisePostItem
            key={item.id}
            id={item.id}
            creator={item.creator}
            createdAt={item.createdAt}
            title={item.title}
            fileName={item.fileName}
            comments={item.comments}
            setGrading={() => {
              // setIsGrading(true);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Reviews;
