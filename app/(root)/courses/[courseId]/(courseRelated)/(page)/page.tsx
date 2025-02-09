"use client";

import IconButton from "@/components/shared/Button/IconButton";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ExercisePostItem from "@/components/shared/PostItem/ExercisePostItem";
import PostItem from "@/components/shared/PostItem/PostItem";
import ReportPostItem from "@/components/shared/PostItem/ReportPostItem";
import TableSearch from "@/components/shared/Search/TableSearch";
import NoResult from "@/components/shared/Status/NoResult";
import { FilterType } from "@/constants";
import { fetchAnnoucements } from "@/services/announcementServices";
import { fetchExercises } from "@/services/exerciseServices";
import { IAnnouncementResponseData } from "@/types/entity/Annoucement";
import { ITExerciseResponseData } from "@/types/entity/Exercise";
import { Dropdown } from "flowbite-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { classCodeAtom, classIdAtom } from "../../../(courses)/(store)/courseStore";
import { useAtomValue } from "jotai";
import { mockPostDataCourseIdPage } from "@/mocks";

const page = () => {
  const getRenderPostItem = (item: any): JSX.Element => {
    switch (item.typePost) {
      case "report":
        return (
          <ReportPostItem
            key={item.id}
            id={item.id}
            creator={item.creator}
            createdAt={item.createdAt}
            title={item.title}
            desc={item.title}
            fileName={item.fileName}
            comments={item.comments}
            setGrading={() => {
              // setIsGrading(true);
            }}
          />
        );
      case "exercise":
        return (
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
        );
      case "announcement":
      default:
        return (
          <PostItem
            key={item.id}
            id={item.id}
            creator={item.creator}
            createdAt={item.createdAt}
            title={item.title}
            desc={item.title}
            fileName={item.fileName}
          />
        );
    }
  };

  const getRenderItems = (): JSX.Element => {
    switch (selectedAnnoucementType) {
      case 1:
        return annoucements.length > 0 ? (
          <>
            {annoucements.map((item, index) => {
              console.log("case item", item);
              return (
                <PostItem
                  key={item.id}
                  id={item.id}
                  creator={item.create_by}
                  createdAt={item.created_date}
                  title={item.name}
                  desc={item.description}
                  fileName={""}
                  // comments={}
                />
              );
            })}
          </>
        ) : (
          <NoResult
            title="Không có thông báo lớp học!"
            description="🚀 Thử tải lại trang để xem thông báo lớp học."
          />
        );
      case 2:
        return exercises.length > 0 ? (
          <>
            {exercises.map((item, index) => {
              return (
                <ExercisePostItem
                  key={item.id}
                  id={item.id}
                  creator={item.created_by}
                  createdAt={item.created_date}
                  title={item.name}
                  desc={item.description}
                  fileName={item.attachment_url}
                />
              );
            })}
          </>
        ) : (
          <NoResult
            title="Không có bài tập lớp học!"
            description="🚀 Thử tải lại trang để xem bài tập lớp học."
          />
        );


      //! fakeAPI mockParams:
      case 4:
        return (
          <ReportPostItem
            key={mockPostDataCourseIdPage[0].id}
            id={mockPostDataCourseIdPage[0].id}
            creator={mockPostDataCourseIdPage[0].creator}
            createdAt={mockPostDataCourseIdPage[0].createdAt}
            title={mockPostDataCourseIdPage[0].title}
            desc={mockPostDataCourseIdPage[0].title}
            fileName={mockPostDataCourseIdPage[0].fileName}
            comments={mockPostDataCourseIdPage[0].comments}
            setGrading={() => {
              // setIsGrading(true);
            }}
          />
        );
      default:
        return (
          <NoResult
            title="Không có dữ liệu!"
            description="💡 Không có thông báo nào."
          />
        );
    }
  };

  //! mockParams: fake API
  const classCode = useAtomValue(classCodeAtom);
  console.log('classCode', classCode)
  const isDA1 = classCode === "SE121.O21.PMCL";

  const annoucementTypes = isDA1
    ? [
        { id: 1, value: "Thông báo" },
        { id: 4, value: "Báo cáo" },
      ]
    : [
        { id: 1, value: "Thông báo" },
        { id: 2, value: "Bài tập" },
        { id: 3, value: "Báo cáo" },
      ];

  const [typeFilter, setTypeFilter] = useState(FilterType.None);

  const cancelDetailFilter = () => {
    setTypeFilter(FilterType.None);
  };

  const [selectedAnnoucementType, setSelectedAnnoucementType] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [exercises, setExercises] = useState<ITExerciseResponseData[]>([]);
  const [annoucements, setAnnoucements] = useState<IAnnouncementResponseData[]>(
    []
  );

  const mockParamsClass_id = "678e0290551a4b14f9d22bed";
  // class_id: "678e0290551a4b14f9d22bed",
  // subclass_code: "SE113.O21.PMCL",

  // useEffect(() => {
  //   if (selectedAnnoucementType === 1) fetchAnnoucementsAPI();
  // }, []);

  useEffect(() => {
    if (selectedAnnoucementType === 1 && annoucements.length === 0)
      fetchAnnoucementsAPI();
    if (selectedAnnoucementType === 2 && exercises.length === 0)
      fetchExercisesAPI();
    // if (selectedAnnoucementType === 3 && exercises.length === 0) fetchReportsAPI();
  }, [selectedAnnoucementType]);

  const fetchAnnoucementsAPI = () => {
    setIsLoading(true);

    fetchAnnoucements(mockParamsClass_id)
      .then((data: any) => {
        console.log("fetchAnnoucements", data);
        setAnnoucements(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  const mockParams = {
    class_id: "678e0290551a4b14f9d22bed",
    subclass_code: "SE113.O21.PMCL",
  };

  const fetchExercisesAPI = () => {
    setIsLoading(true);

    fetchExercises(mockParams)
      .then((data: any) => {
        console.log("fetchExercises data", data);
        setExercises(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  console.log("annoucements", annoucements);

  return (
    <div>
      {isLoading ? <LoadingComponent /> : null}
      <div
        className="
        mt-6 mb-10 flex w-full gap-6 sm:flex-row sm:items-center justify-between"
      >
        {/* Search & Filter */}
        <div className="flex items-center gap-2 justify-start w-2/3">
          <TableSearch
            setSearchTerm={() => {}}
            searchTerm={""}
            otherClasses="w-[50%]"
          />

          <Dropdown
            className="z-30 rounded-lg w-[25%]"
            label=""
            dismissOnClick={false}
            renderTrigger={() => (
              <div>
                <IconButton
                  text={`${
                    annoucementTypes[selectedAnnoucementType - 1].value
                  }`}
                  iconRight={"/assets/icons/chevron-down.svg"}
                  bgColor="bg-white"
                  textColor="text-black"
                  border
                />
              </div>
            )}
          >
            <div className="w-full scroll-container scroll-container-dropdown-content">
              {annoucementTypes.map((type, index) => (
                <Dropdown.Item
                  key={`${type.id}_${index}`}
                  onClick={() => {
                    if (selectedAnnoucementType === type.id) {
                      setSelectedAnnoucementType(1);
                    } else {
                      setSelectedAnnoucementType(type.id);
                    }
                  }}
                  className="min-w-max"
                >
                  <div className="flex justify-between w-full">
                    <p className="w-[80%] text-left line-clamp-1">
                      {type.value}
                    </p>
                    {selectedAnnoucementType === type.id ? (
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

          <Dropdown
            className="z-30 rounded-lg w-[25%]"
            label=""
            dismissOnClick={false}
            renderTrigger={() => (
              <div>
                <IconButton
                  text="Bộ lọc"
                  iconLeft={
                    typeFilter === FilterType.None
                      ? "/assets/icons/filter.svg"
                      : "/assets/icons/filter_active.svg"
                  }
                  iconRight={"/assets/icons/chevron-down.svg"}
                  bgColor="bg-white"
                  textColor="text-black"
                  border
                />
              </div>
            )}
          >
            <Dropdown.Header>
              <span
                onClick={() => {
                  cancelDetailFilter();
                }}
                className="block truncate text-sm font-medium cursor-pointer"
              >
                Bỏ bộ lọc
              </span>
            </Dropdown.Header>
            <ul className=" text-sm" aria-labelledby="filterDropdownButton">
              <li
                className="flex items-center
                    w-full
                    justify-start
                    px-4
                    py-2
                    text-sm
                    text-gray-700
                    focus:outline-none
                    "
              >
                <input
                  checked={typeFilter === FilterType.SortNewer}
                  id="SortNewer"
                  type="radio"
                  name="filterOptions"
                  value={FilterType.SortNewer}
                  onChange={() => {
                    setTypeFilter(FilterType.SortNewer);
                  }}
                  className="w-4 h-4  cursor-pointer bg-gray-100 border-gray-300 rounded text-primary-600"
                />
                <label
                  htmlFor="SortNewer"
                  className="ml-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Mới nhất
                </label>
              </li>
              <li
                className="flex items-center
                    w-full
                    justify-start
                    px-4
                    py-2
                    text-sm
                    text-gray-700
                    focus:outline-none
                    "
              >
                <input
                  checked={typeFilter === FilterType.SortOlder}
                  id="SortOlder"
                  type="radio"
                  name="filterOptions"
                  value={FilterType.SortOlder}
                  onChange={() => {
                    setTypeFilter(FilterType.SortOlder);
                  }}
                  className="w-4 h-4  cursor-pointer bg-gray-100 border-gray-300 rounded text-primary-600"
                />
                <label
                  htmlFor="SortOlder"
                  className="ml-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  Cũ nhất
                </label>
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>

      {/* PostList */}
      <div className="mt-6 flex flex-col gap-4">
        {/* //! mockParams */}
        {/* {mockPostDataCourseIdPage.map((item, index) => {
          return getRenderPostItem(item);
        })} */}

        {!isLoading ? getRenderItems() : null}
      </div>
    </div>
  );
};

export default page;
