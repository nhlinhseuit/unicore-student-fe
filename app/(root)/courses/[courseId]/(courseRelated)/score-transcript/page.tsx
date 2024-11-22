"use client";

import ScoreColumnDetailPage from "@/components/shared/ScoreTranscript/ScoreColumnDetailPage";
import ScoreTranscriptTableCourse from "@/components/shared/Table/TableScoreTranscriptCourse/ScoreTranscriptTableCourse";
import { mockDataScoreTranscript, mockDataScoreTranscriptCourse, mockGradeColumnPercent } from "@/mocks";
import { useState } from "react";

const ScoreTranscript = () => {
  const [isEditTable, setIsEditTable] = useState(false);
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
        <>
          {/* //TODO: BÀI TẬP */}
          <ScoreTranscriptTableCourse
            isEditTable={isEditTable}
            isMultipleDelete={false}
            dataTable={mockDataScoreTranscriptCourse}
            dataGradeColumnPercent={mockGradeColumnPercent}
            viewDetailGradeColumn={() => {
              setIsViewDetailGradeColumn(true);
            }}
          />
        </>
      )}
    </>
  );
};

export default ScoreTranscript;
