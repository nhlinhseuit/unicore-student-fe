"use client";

import BorderButton from "@/components/shared/Button/BorderButton";
import ReviewExercisePostItem from "@/components/shared/PostItem/ReviewExercisePostItem";
import { ReviewTabs } from "@/constants";
import { mockPostData } from "@/mocks";
import { useState } from "react";

const Reviews = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(
    ReviewTabs[0].value
  );

  return (
    <div>
      {/* ReviewTabs */}
      <div className="flex gap-2">
        {ReviewTabs.map((item) => {
          return (
            <BorderButton
              key={item.value}
              text={item.label}
              value={item.value}
              onClick={(value) => {
                setSelectedAnnouncement(value);
              }}
              isActive={selectedAnnouncement === item.value}
            />
          );
        })}
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
