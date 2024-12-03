"use client";

import ScoreColumnDetailPage from "@/components/shared/ScoreTranscript/ScoreColumnDetailPage";
import ScoreTranscriptTable from "@/components/shared/Table/TableScoreTranscript/ScoreTranscriptTable";
import {
  mockDataScoreTranscriptStudent,
  mockGradeColumnPercent,
} from "@/mocks";
import { useState } from "react";

const ScoreTranscript = () => {
  const [selectedCourse, setSelectedCourse] = useState(-1);
  const [isViewDetailGradeColumn, setIsViewDetailGradeColumn] = useState(false);

  return (
    <>
      {isViewDetailGradeColumn ? (
        <ScoreColumnDetailPage
          onClickPrev={() => {
            setIsViewDetailGradeColumn(false);
          }}
        />
      ) : (
        // TODO: ĐIỂM THEO TỪNG HỌC KỲ
        <div>
          {mockDataScoreTranscriptStudent.map((item) => (
            <div>
              <p className="mt-10 mb-10 paragraph-semibold">
                {`Học kỳ ${item["Học kỳ"]} - Năm học ${item["Năm học"]}`}
              </p>

              <ScoreTranscriptTable
                dataTable={item}
                dataGradeColumnPercent={mockGradeColumnPercent}
                viewDetailGradeColumn={() => {
                  setIsViewDetailGradeColumn(true);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ScoreTranscript;
