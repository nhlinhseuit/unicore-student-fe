import { classCodeAtom } from "@/app/(root)/courses/(courses)/(store)/courseStore";
import RegisterReportSchedule from "@/components/courses/RegisterReportSchedule";
import SubmitReport from "@/components/courses/SubmitReport";
import { getAvatarName } from "@/lib/utils";
import { mockSubmitExercisePost } from "@/mocks";
import { useAtomValue } from "jotai";
import MyAvatar from "../../courses/MyAvatar";
import MyComment from "../../courses/MyComment";
import OtherComment from "../../courses/OtherComment";
import RenderFile from "../Annoucements/RenderFile";
import StatusButton from "../Button/StatusButton";
import Divider from "../Divider";
import {
  getSubmissionsOfPost,
  getDetailSubmissionsOfPost,
} from "@/services/submissionServices";
import { IDetailSubmissionsOfPostResponseData } from "@/types/entity/DetailSubmissionsOfPost";
import { useState, useEffect } from "react";

import Prism from "prismjs";
import parse from "html-react-parser";

import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-r";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import NotSubmitReport from "@/components/courses/NotSubmitReport";

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
  comments?: Comment[];
  setGrading: () => void;
}

const ReportPostItem = (params: Props) => {
  //! mockParams: fake API
  const classCode = useAtomValue(classCodeAtom);
  const isDA1 = true;
  // const isDA1 = classCode === "SE121.O21.PMCL";

  const [submissionsOfStudent, setSubmissionsOfStudent] =
    useState<IDetailSubmissionsOfPostResponseData>();

  const mockParamsStudentCode = "21522289";

  const mockParamsHOMEWORKID = "678e0290551a4b14f9d22bed";

  useEffect(() => {
    // params.id
    getSubmissionsOfPost(mockParamsHOMEWORKID).then((data) => {
      if (data.data) {
        const submissionsOfStd: IDetailSubmissionsOfPostResponseData =
          data.data.find((item: any) => {
            return item.submitters.find(
              (item: any) => item.student_code === mockParamsStudentCode
            );
          });

        setSubmissionsOfStudent(submissionsOfStd);
      }
    });

    Prism.highlightAll();
  }, []);

  console.log("submissionsOfStudent", submissionsOfStudent);

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
            orange
            text="Báo cáo"
            smallText
            otherClasses="rounded-md ml-4"
            infoComponent={
              <ul className="text-white text-[12px] text-left">
                <li role="menuitem">
                  <span>
                    Thời hạn nộp bài: 12h SA 8/11/2024 - 11h30 SA 15/11/2024
                  </span>
                </li>
                <li role="menuitem">
                  <span>
                    Thời hạn nộp trễ: 12h SA 8/11/2024 - 11h30 SA 15/11/2024
                  </span>
                </li>
                <li role="menuitem">
                  <span>Thời hạn đóng bài nộp: 12h SA 16/11/2024</span>
                </li>
              </ul>
            }
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

        <RenderFile _id={1} name={"exercise.docx"} otherClasses={"mt-3 px-2"} />

        <Divider />

        {/* //! fake API: kh demo chọn lịch */}
        {isDA1 ? (
          submissionsOfStudent ? (
            <>
              <SubmitReport
                postId={params.id}
                submissionsOfStudent={submissionsOfStudent}
                score={mockSubmitExercisePost.score}
                totalScore={mockSubmitExercisePost.totalScore}
                feedback={mockSubmitExercisePost.feedback}
                lateTime={mockSubmitExercisePost.lateTime}
                lastEdited={mockSubmitExercisePost.lastEdited}
                submission={mockSubmitExercisePost.submission}
                review={mockSubmitExercisePost.review}
              />
              <Divider />
            </>
          ) : (
            <NotSubmitReport
              postId={params.id}
              setSubmitTrue={(data: IDetailSubmissionsOfPostResponseData) => {
                //@ts-ignore
                submissionsOfStudent(data);
              }}
              score={mockSubmitExercisePost.score}
              totalScore={mockSubmitExercisePost.totalScore}
              feedback={mockSubmitExercisePost.feedback}
              lateTime={mockSubmitExercisePost.lateTime}
              lastEdited={mockSubmitExercisePost.lastEdited}
              submission={mockSubmitExercisePost.submission}
              review={mockSubmitExercisePost.review}
            />
          )
        ) : (
          <RegisterReportSchedule />
        )}
        {/* <RegisterReportSchedule /> */}

        {/* <div className="flex flex-col gap-4">
          {params.comments &&
            params.comments.map((item, index) => (
              <div key={item.id}>
                <OtherComment
                  textAvatar={getAvatarName(item.author)}
                  name={item.author}
                  comment={item.content}
                />
                <Divider />
                </div>
                ))}
                </div> */}

        <Divider />
        <MyComment textAvatar="HL" type="report" sourceId={params.id} />
      </div>
    </div>
  );
};

export default ReportPostItem;
