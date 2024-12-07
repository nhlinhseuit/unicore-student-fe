import { mockDataReviewGradeExercise } from "@/mocks";
import { useState } from "react";
import IconButton from "../shared/Button/IconButton";
import NoResult from "../shared/Status/NoResult";
import ReviewGradeTable from "../shared/Table/TableReviewGrade/ReviewGradeTable";

interface Props {
  exerciseId: string;
}

const ReviewExercise = (params: Props) => {
  const [isEditTable, setIsEditTable] = useState(false);
  const reviewData = mockDataReviewGradeExercise.find(
    (item) => item.exerciseId === params.exerciseId
  );

  return (
    <>
      <div className="flex gap-4 items-center">
        <p className="paragraph-semibold underline ">Phúc khảo</p>
      </div>

      <div className="mt-4">
        {reviewData ? (
          <ReviewGradeTable
            isEditTable={isEditTable}
            isMultipleDelete={false}
            dataTable={reviewData}
          />
        ) : (
          <NoResult
            title="Không có dữ liệu!"
            description="🚀 Import file danh sách để thấy được dữ liệu."
            linkTitle="Import danh sách đề tài"
            // handleFileUpload={handleTopicsFileUpload}
          />
        )}
      </div>
    </>
  );
};

export default ReviewExercise;
