"use client";

import IconButton from "@/components/shared/Button/IconButton";
import RegisterGroupTable from "@/components/shared/Table/TableRegisterGroup/RegisterGroupTable";
import { useEffect, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import BorderContainer from "@/components/shared/BorderContainer";
import SubmitButton from "@/components/shared/Button/SubmitButton";
import NoResult from "@/components/shared/Status/NoResult";
import StudentItem from "@/components/shared/StudentItem";
import TableSkeleton from "@/components/shared/Table/components/TableSkeleton";
import TitleDescription from "@/components/shared/TitleDescription";
import { Action, maxStudentPerGroup, minStudentPerGroup } from "@/constants";
import { toast } from "@/hooks/use-toast";
import {
  deleteGroup,
  fetchGroupRegisterSchedule,
  registerGroup,
} from "@/services/groupRegisterServices";
import Student, { IStudentResponseData } from "@/services/Student";
import { fetchStudents } from "@/services/studentServices";
import {
  convertGroupDataToRegisterGroupDataItem,
  IGroup,
  IGroupRegisterResponseData,
  IMember,
  RegisterGroupDataItem,
} from "@/types/entity/GroupRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useAtomValue } from "jotai";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { groupingIdAtom } from "../../../(courses)/(store)/courseStore";
import { formatISOToDayDatatype } from "@/utils/dateTimeUtil";
import { format } from "date-fns";
import LoadingComponent from "@/components/shared/LoadingComponent";

const ManageGroup = () => {
  const pathName = usePathname();
  const courseId = pathName.split("/")[2];

  const [isAlreadyRegisteredGroupVar, setIsAlreadyRegisteredGroupVar] =
    useState<IGroup>();

  const [isShowDialog, setIsShowDialog] = useState(Action.none);

  // const [selectedStudents, setSelectedStudents] = useState<IMember[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  

  const AnnoucementSchema = z
    .object({
      nameGroup: z
        .string()
        .min(1, { message: "Bạn phải điền tên nhóm" })
        .max(100, { message: "Tên nhóm chứa tối đa 100 ký tự" }),
      studentList: z.string().optional(),
    })
    //! mockParams:
    // .refine(() => selectedStudents.length >= minStudentPerGroup, {
    //   message: `Nhóm phải có ít nhất ${minStudentPerGroup} thành viên.`,
    //   path: ["studentList"],
    // })
    .refine(() => selectedStudents.length <= maxStudentPerGroup, {
      message: `Nhóm chỉ được phép tối đa ${maxStudentPerGroup} thành viên.`,
      path: ["studentList"],
    });

  const form = useForm<z.infer<typeof AnnoucementSchema>>({
    resolver: zodResolver(AnnoucementSchema),
    defaultValues: {
      nameGroup: "",
      studentList: "",
    },
  });

  //TODO: TABLE
  const [isEditTable, setIsEditTable] = useState(false);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [dataTable, setDataTable] = useState<RegisterGroupDataItem[]>();

  const [minMember, setMinMember] = useState("");
  const [maxMember, setMaxMember] = useState("");
  const [selectedLeaderOption, setSelectedLeaderOption] = useState(false);
  const [dateStart, setDateStart] = useState<Date>();
  const [dateEnd, setDateEnd] = useState<Date>();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [groupRegisterSchedule, setGroupRegisterSchedule] =
    useState<IGroupRegisterResponseData>();

  const groupingId = useAtomValue(groupingIdAtom);
  const mockParamsGroupingId = "2f92d554-747d-4183-b8e3-f767437cabd3";

  const getIsAlreadyRegisterGroup = (
    groupRegisterSchedule?: IGroupRegisterResponseData
  ): IGroup | undefined => {
    //TODO: Khi authen vào thì lưu vào jotai
    const mockParamsMyStudentCode = "21522289";

    if (!groupRegisterSchedule) {
      return undefined; // Không có dữ liệu nhóm, trả về false
    }

    // Tìm nhóm chứa myStudentCode
    return groupRegisterSchedule.groups.find((group) =>
      group.members.some(
        (member) => member.student_code === mockParamsMyStudentCode
      )
    );
  };

  useEffect(() => {
    //@ts-ignore
    if (mockParamsGroupingId !== "") {
      fetchGroupRegisterSchedule(mockParamsGroupingId)
        .then((data: IGroupRegisterResponseData) => {
          if (data) {
            console.log("fetchGroupRegisterSchedule", data);
            console.log(
              "convertGroupDataToRegisterGroupDataItem(data.groups)",
              convertGroupDataToRegisterGroupDataItem(data.groups)
            );

            setDataTable(convertGroupDataToRegisterGroupDataItem(data.groups));

            //?
            setDateStart(formatISOToDayDatatype(data.start_register_date));
            setDateEnd(formatISOToDayDatatype(data.end_register_date));
            setMaxMember(data.max_size.toString());
            setMinMember(data.min_size.toString());
            // ! mockParams
            // setSelectedLeaderOption(data.hasLeader)
            // check xem đăng ký chưa, nếu dkdy rồi thì gán vào
            setIsAlreadyRegisteredGroupVar(getIsAlreadyRegisterGroup(data));

            setGroupRegisterSchedule(data);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  //! hoàn thiện API: Check xem có trùng sinh viên ở nhóm khác không +++ Khi đã đky r thì check để gán vào data cho alertdialog
  //! hoàn thiện API: Viết lại hàm này khi xác định được API để check 1 sv ngoài lớp mà cùng gv (các model của dataSource)

  const isStudentAlreadyInOtherGroup = (
    groups: IGroup[]
  ): number | undefined => {
    return undefined;
  };

  const handleDelete = () => {
    console.log("handleDelete");

    setIsLoadingAPI(true);

    console.log("delete data", isAlreadyRegisteredGroupVar?.id ?? "");

    deleteGroup(isAlreadyRegisteredGroupVar?.id ?? "").then((data) => {
      console.log("deleteGroup", data);

      //! mockParams: check lại chỗ này
      console.log("data.data.groups", data.data.groups);
      // setDataTable(convertGroupDataToRegisterGroupDataItem(data.data.groups));

      toast({
        title: "Xóa thông tin đăng ký nhóm thành công.",
        variant: "success",
        duration: 3000,
      });

      setIsLoadingAPI(false);
      // lấy nhóm vừa đky từ data trả về để hiện trên UI
      setIsAlreadyRegisteredGroupVar(undefined);
      setIsShowDialog(Action.none);
      return;
    });
  };

  async function onSubmit(values: any) {
    try {
      if (groupRegisterSchedule?.groups) {
        const groupIndex = isStudentAlreadyInOtherGroup(
          groupRegisterSchedule?.groups
        );

        if (groupIndex !== undefined) {
          toast({
            title: "Đăng ký nhóm lỗi.",
            description: `Sinh viên đã tồn tại trong nhóm thứ ${groupIndex}`,
            variant: "success",
            duration: 3000,
          });
          return;
        }
      }

      const mockParams = {
        name: values.nameGroup,
        //? CODE LẤY DATA Ở ĐÂY
        // members: students.map((student) => ({
        //   name: student.name,
        //   phone: student.phone || "",
        //   class_id: student.organization_id,
        //   subclass_code: student.advisory_class,
        //   student_code: student.code,
        //   group_name: values.nameGroup,
        // })),
        members: [
          {
            name: "Le Thanh BA",
            phone: "123123",
            class_id: "677fefdd854d3e02e4191707",
            subclass_code: "IT002.O21.CLC",
            student_code: "21522289",
            group_name: "nhóm 1",
          },
          {
            name: "Le Thanh CA",
            phone: "123123",
            class_id: "677fefdd854d3e02e4191707",
            subclass_code: "IT002.O21.CLC",
            student_code: "2153",
            group_name: "nhóm 1",
          },
        ],
        grouping_id: mockParamsGroupingId,
      };

      setIsLoadingAPI(true);
      registerGroup(mockParams).then((data) => {
        console.log("registerGroup", data);

        //! mockParams: check lại chỗ này
        console.log("data.data.groups", data.data.groups);
        setDataTable(convertGroupDataToRegisterGroupDataItem(data.data.groups));

        toast({
          title:
            isShowDialog === Action.create
              ? "Đăng ký nhóm thành công."
              : "Sửa thông tin nhóm thành công.",
          variant: "success",
          duration: 3000,
        });

        setIsLoadingAPI(false);
        // lấy nhóm vừa đky từ data trả về để hiện trên UI
        setIsAlreadyRegisteredGroupVar(getIsAlreadyRegisterGroup(data.data));
        setIsShowDialog(Action.none);
      });

      // ? không cần reset để lần sau có thể chỉnh sửa
      // reset({
      //   nameGroup: "",
      // });
    } catch {
    } finally {
    }
  }

  console.log("dataTable", dataTable);

  // ! STUDENT OUTSIDE CLASS
  const studentIdRef = useRef<HTMLInputElement>(null);
  const updateStudentId = (value: string) => {
    if (studentIdRef.current) {
      studentIdRef.current.value = value;
    }
  };

  const [suggestion, setSuggestion] = useState(false);
  const [placeholder, setPlaceholder] = useState("Nhập mã số sinh viên");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  //!: hoàn thiện API: check xem sinh viên có thỏa điều kiện sinh viên khác lớp, nhưng phải cùng giảng viên giảng dạy và cùng môn học?

  const isHasStudentInDb = () => {
    // if (studentIdRef.current && students.length > 0) {
    //   return students.find((item) => item.id === studentIdRef.current!.value);
    // }
    // return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //!: hoàn thiện API:
    // const value = e.target.value;
    // updateStudentId(value);
    // if (debounceRef.current) {
    //   clearTimeout(debounceRef.current);
    // }
    // debounceRef.current = setTimeout(() => {
    //   if (isHasStudentInDb()) {
    //     setSuggestion(true);
    //   } else {
    //     setSuggestion(false);
    //   }
    // }, 300);
  };

  // const handleSuggestionClick = () => {
  //   if (studentIdRef.current) {
  //     if (
  //       selectedStudents.some(
  //         (item) => item.student_code === studentIdRef.current!.value
  //       )
  //     ) {
  //       setSuggestion(false);
  //       updateStudentId("");
  //       return;
  //     }
  //   }

  //   setSelectedStudents((prev) => [...prev, isHasStudentInDb()!]);
  //   setSuggestion(false);
  //   updateStudentId("");
  // };

  //! FAKE API
  const handleSuggestionClick = () => {
    if (studentIdRef.current) {
      if (
        selectedStudents.some((item) => item.id === studentIdRef.current!.value)
      ) {
        setSuggestion(false);
        updateStudentId("");
        return;
      }
    }

    setSelectedStudents((prev) => [...prev, isHasStudentInDb()!]);
    setSuggestion(false);
    updateStudentId("");
  };

  const handleFocus = () => {
    //!: hoàn thiện API:
    // if (isHasStudentInDb()) {
    //   setSuggestion(true); // Hiển thị gợi ý nếu khớp
    // } else {
    //   setSuggestion(false); // Ẩn gợi ý nếu không khớp
    // }
  };

  const handleClickOutside = (e: MouseEvent) => {
    //? ẩn gợi ý
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setSuggestion(false); // Tắt suggestion khi click ra ngoài
    }
  };

  useEffect(() => {
    //? ẩn gợi ý
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {isLoadingAPI ? <LoadingComponent /> : null}
      <TitleDescription
        title="Đăng ký nhóm"
        description={[
          selectedLeaderOption ? "Lưu ý: Nhóm trưởng điền tên đầu tiên" : "",
          `Thời hạn: ${
            dateStart ? format(dateStart, "dd/MM/yyyy") : "Ngày bắt đầu"
          }
          - ${dateEnd ? format(dateEnd, "dd/MM/yyyy") : "Ngày bắt đầu"}`,
          `Số lượng thành viên nhóm: Tối thiểu ${minMember} - Tối đa ${maxMember}`,
        ]}
      />

      <div className="flex items-center justify-end mb-3 gap-2">
        <IconButton
          text={
            isAlreadyRegisteredGroupVar ? "Sửa thông tin nhóm" : "Đăng ký nhóm"
          }
          yellow={isAlreadyRegisteredGroupVar ? true : false}
          green={isAlreadyRegisteredGroupVar ? false : true}
          iconLeft={
            isAlreadyRegisteredGroupVar
              ? "/assets/icons/edit.svg"
              : "/assets/icons/add.svg"
          }
          iconWidth={22}
          iconHeight={22}
          onClick={
            isAlreadyRegisteredGroupVar
              ? () => setIsShowDialog(Action.edit)
              : () => setIsShowDialog(Action.create)
          }
        />
        {isAlreadyRegisteredGroupVar ? (
          <IconButton
            text={"Xóa nhóm"}
            red
            iconWidth={22}
            iconHeight={22}
            onClick={() => setIsShowDialog(Action.delete)}
          />
        ) : null}
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : dataTable &&
        dataTable.filter((item) => !item.isDeleted).length > 0 ? (
        <RegisterGroupTable dataTable={dataTable} />
      ) : (
        <NoResult
          title="Không có dữ liệu!"
          description="🚀 Chưa có nhóm nào được đăng ký."
        />
      )}

      <AlertDialog open={isShowDialog !== Action.none}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className=" text-lg font-semibold text-center">
              {isShowDialog === Action.delete
                ? "Bạn có chắc chắn muốn xóa?"
                : isShowDialog === Action.create
                ? "Đăng ký nhóm"
                : "Sửa thông tin nhóm"}
            </AlertDialogTitle>
            {isShowDialog === Action.delete ? (
              <AlertDialogDescription>
                Thao tác này không thể hoàn tác, dữ liệu của bạn sẽ bị xóa vĩnh
                viễn và không thể khôi phục.
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>

          <div className="flex flex-col gap-6">
            {isShowDialog === Action.delete ? (
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <IconButton
                  cancel
                  text={"Hủy"}
                  onClick={() => {
                    setIsShowDialog(Action.none);
                  }}
                />
                <IconButton text={"Đồng ý"} onClick={handleDelete} />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-10">
                    <FormField
                      control={form.control}
                      name="nameGroup"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                          <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                            Tên nhóm
                          </FormLabel>
                          <FormDescription className="body-regular mt-2.5 text-light-500">
                            Không bắt buộc.
                          </FormDescription>
                          <FormControl className="mt-3.5 ">
                            <Input
                              {...field}
                              placeholder="Nhập tên nhóm..."
                              className="
                                    no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Danh sách thành viên nhóm */}
                    <FormField
                      control={form.control}
                      name="studentList"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                          <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                            Danh sách thành viên nhóm{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormDescription className="body-regular mt-2.5 text-light-500">
                            Nhóm trưởng điền tên đầu tiên. Thành viên nhóm phải
                            là sinh viên của lớp hiện tại.
                          </FormDescription>

                          {/* //!: API setting của lớp học để hiển thị cái này */}
                          <FormDescription className="body-regular mt-2.5 text-light-500">
                            Hoặc thành viên nhóm có thể là sinh viên khác lớp,
                            nhưng phải cùng giảng viên giảng dạy và cùng môn
                            học.
                          </FormDescription>
                          <FormControl className="mt-3.5 ">
                            <div className="mt-6">
                              <div>
                                <div className="relative" ref={ref}>
                                  <Input
                                    ref={studentIdRef}
                                    onChange={handleChange}
                                    name="studentIdRef"
                                    placeholder={placeholder}
                                    onFocus={handleFocus}
                                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[46px] border"
                                  />
                                  {suggestion && (
                                    <div
                                      className="absolute left-0 z-50 w-full mt-1 bg-white cursor-pointer p-2 rounded-md border normal-regular no-focus text-dark300_light700 min-h-[46px] shadow-lg"
                                      onClick={handleSuggestionClick}
                                    >
                                      {/* //!: hoàn thiện API: */}
                                      {/* //! mockParams: Cần có lớp mà sinh viên này đang học */}
                                      {/* {isHasStudentInDb()?.id} -{" "}
                                      {isHasStudentInDb()?.name} -{" "} 
                                     {isHasStudentInDb()?.class} */}
                                    </div>
                                  )}
                                </div>
                                {selectedStudents.length > 0 ? (
                                  <BorderContainer otherClasses="mt-3">
                                    <div className="my-4 ml-4">
                                      {/* {selectedStudents && (
                                        <div className="flex flex-col gap-4">
                                          {selectedStudents.map(
                                            (item, index) => (
                                              <div key={item.student_code}>
                                                <StudentItem
                                                  item={item}
                                                  index={index}
                                                  courseId={courseId}
                                                  selectedStudents={
                                                    selectedStudents
                                                  }
                                                  setSelectedStudents={
                                                    setSelectedStudents
                                                  }
                                                />
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )} */}
                                      
                                      {/* //! FAKE API */}
                                      {selectedStudents && (
                                        <div className="flex flex-col gap-4">
                                          {selectedStudents.map(
                                            (item, index) => (
                                              <div key={item.id}>
                                                <StudentItem
                                                  item={item}
                                                  index={index}
                                                  courseId={courseId}
                                                  selectedStudents={
                                                    selectedStudents
                                                  }
                                                  setSelectedStudents={
                                                    setSelectedStudents
                                                  }
                                                />
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </BorderContainer>
                                ) : null}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                      <IconButton
                        cancel
                        text={"Hủy"}
                        onClick={() => {
                          setIsShowDialog(Action.none);
                        }}
                      />
                      <SubmitButton text={"Đồng ý"} />
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageGroup;
