"use client";

import BigExerciseItem from "@/components/shared/BigExercise/BigExerciseItem";
import BorderContainer from "@/components/shared/BorderContainer";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ToggleTitle from "@/components/shared/ToggleTitle";
import { mockBigExercisesList, mockCentralizedExam } from "@/mocks";
import {
  fetchCentralizedExamInClass,
  fetchProjectsInClass,
} from "@/services/projectServices";
import { ICentralizedTestResponseData } from "@/types/entity/CentralizedTest";
import { ITProjectResponseData } from "@/types/entity/Project";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const BigExercises = () => {
  const pathName = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<ITProjectResponseData[]>([]);
  const [centralizedExams, setCentralizedExams] = useState<
    ICentralizedTestResponseData[]
  >([]);

  const mockParams1 = {
    class_id: "678e0290551a4b14f9d22bed",
    subclass_code: "SE113.O21.PMCL",
  };

  const mockParams2 = {
    class_id: "6780ff6e854d3e02e4191716",
    subclass_code: "IT001.O21.CLC",
  };

  useEffect(() => {
    let pendingRequests = 2; // Theo dõi số lượng lời gọi đang xử lý
    setIsLoading(true);

    fetchProjectsInClass(mockParams1)
      .then((data: any) => {
        setProjects(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        pendingRequests -= 1;
        if (pendingRequests === 0) {
          setIsLoading(false);
        }
      });

    fetchCentralizedExamInClass(mockParams2)
      .then((data: any) => {
        console.log("fetchCentralizedExamInClass", data);
        setCentralizedExams(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        pendingRequests -= 1;
        if (pendingRequests === 0) {
          setIsLoading(false);
        }
      });
  }, []);

  const [isToggleShowBigExercise, setIsToggleShowBigExercise] = useState(true);
  const [isToggleShowCentralizedExam, setIsToggleShowCentralizedExam] =
    useState(true);

  const [isToggleShowReportSchedule, setIsToggleShowReportSchedule] =
    useState(true);

  const mockReportOptions = [
    {
      id: 0,
      value: "Ngày 3/10, 7h30h - 8h",
      groups: ["Nhóm 1", "Nhóm 2"],
    },
    {
      id: 1,
      value: "Ngày 3/10, 8h - 8h30",
      groups: ["Nhóm 3", "Nhóm 4"],
    },
    {
      id: 2,
      value: "Ngày 3/10, 9h - 9h30",
      groups: ["Nhóm 5", "Nhóm 6"],
    },
    {
      id: 3,
      value: "Ngày 3/10, 10h - 10h30",
      groups: ["Nhóm 7", "Nhóm 8"],
    },
  ];

  return (
    <div>
      {isLoading ? <LoadingComponent /> : null}
      <div className="flex flex-col gap-4">
        <ToggleTitle
          text="Lịch báo cáo đồ án"
          handleClick={() => {
            setIsToggleShowReportSchedule(!isToggleShowReportSchedule);
          }}
          value={isToggleShowReportSchedule}
        />
        {isToggleShowReportSchedule ? (
          <BorderContainer otherClasses="p-6 flex flex-col gap-4">
            {mockReportOptions.map((item, index) => (
              <div>
                <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-red-900 text-dark400_light800 text-[14px] font-medium leading-[20.8px]">
                  <span className="font-semibold">
                    {item.id + 1}. {item.value}:{" "}
                  </span>
                  {item.groups.join(", ")}
                </label>
              </div>
            ))}
          </BorderContainer>
        ) : null}

        <ToggleTitle
          text="Thi tập trung"
          handleClick={() => {
            isToggleShowCentralizedExam;

            setIsToggleShowCentralizedExam(!isToggleShowCentralizedExam);
          }}
          value={isToggleShowCentralizedExam}
        />
        {isToggleShowCentralizedExam
          ? centralizedExams.map((item) => (
              <BigExerciseItem
                isCentralizedExam
                id={item.id}
                name={item.name}
                creator={item.created_by}
                createdAt={item.created_date}
                deadline={item.date}
              />
            ))
          : null}

        <ToggleTitle
          text="Bài tập lớn"
          handleClick={() => {
            setIsToggleShowBigExercise(!isToggleShowBigExercise);
          }}
          value={isToggleShowBigExercise}
        />
        {isToggleShowBigExercise
          ? projects.map((item) => (
              <Link key={item.id} href={`${pathName}/big-exercises/${item.id}`}>
                <BigExerciseItem
                  id={item.id}
                  name={item.name}
                  creator={item.created_by}
                  createdAt={item.created_date}
                  happeningEvent={""}
                  deadline={""}
                />
              </Link>
            ))
          : null}
      </div>
    </div>
  );
};

export default BigExercises;
