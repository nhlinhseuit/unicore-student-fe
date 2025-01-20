"use client";

import ExercisePostItem from "@/components/shared/PostItem/ExercisePostItem";
import { mockPostData } from "@/mocks";


const Exercises = () => {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {mockPostData.map((item, index) => (
        <ExercisePostItem
          key={item.id}
          id={item.id}
          creator={item.creator}
          createdAt={item.createdAt}
          title={item.title}
            desc={item.title}
            fileName={item.fileName}
          comments={item.comments}
        />
      ))}
    </div>
  );
};

export default Exercises;
