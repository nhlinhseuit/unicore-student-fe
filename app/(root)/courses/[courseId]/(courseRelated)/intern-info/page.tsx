"use client";

import IconButton from "@/components/shared/Button/IconButton";
import { mockDataStudentInternInfo } from "@/mocks";
import { useState } from "react";

import TitleDescription from "@/components/shared/TitleDescription";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Action } from "@/constants";
import { toast } from "@/hooks/use-toast";
import Student from "@/services/Student";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { InternInfoItem } from "@/types/entity/Topic";
import { formatDayToDataIntable } from "@/utils/dateTimeUtil";
import { vi } from "date-fns/locale";
import InternInfoTable from "./InternInfoTable";

const ManageGroup = () => {
  const pathName = usePathname();
  const courseId = pathName.split("/")[2];

  const [isAlreadyEnterInternInfo, setIsAlreadyEnterInternInfo] =
    useState(false);

  const [isShowDialog, setIsShowDialog] = useState(Action.none);

  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  const [dataTable, setDataTable] = useState<InternInfoItem[]>(
    mockDataStudentInternInfo
  );

  console.log("dataTable", dataTable);

  const AnnoucementSchema = z
    .object({
      // company: z
      //   .string()
      //   .min(1, { message: "Bạn phải điền tên nhóm" })
      //   .max(100, { message: "Tên nhóm chứa tối đa 100 ký tự" }),
      // internContent: z
      //   .string()
      //   .min(1, { message: "Bạn phải điền tên nhóm" })
      //   .max(100, { message: "Tên nhóm chứa tối đa 100 ký tự" }),
      // internTitleJob: z
      //   .string()
      //   .min(1, { message: "Bạn phải điền tên nhóm" })
      //   .max(100, { message: "Tên nhóm chứa tối đa 100 ký tự" }),
      company1: z.string(),
      internContent1: z.string(),
      internTitleJob1: z.string(),
      startDate1: z.string(),
      endDate1: z.string(),
    })
    .refine(() => company === "", {
      message: `Bạn phải điền nơi thực tập.`,
      path: ["company1"],
    })
    .refine(() => internContent !== "", {
      message: `Bạn phải điền nội dung thực tập.`,
      path: ["internContent1"],
    })
    .refine(() => internTitleJob !== "", {
      message: `Bạn phải điền vị trí thực tập.`,
      path: ["internTitleJob1"],
    })
    .refine(() => startDate !== undefined, {
      message: `Bạn phải chọn ngày kết thúc.`,
      path: ["startDate1"],
    })
    .refine(() => endDate !== undefined, {
      message: `Bạn phải chọn ngày kết thúc.`,
      path: ["endDate1"],
    });

  const form = useForm<z.infer<typeof AnnoucementSchema>>({
    resolver: zodResolver(AnnoucementSchema),
    defaultValues: {},
  });

  const mockParamsStudentCode = "21522289";
  const mockParamsStudentName = "Nguyễn Hoàng Linh";
  const mockParamsStudentMail = "21522289@gm.uit.edu.vn";
  const mockParamsTeacherName = "Th.S Lê Thanh Trọng";
  const mockParamsTeacherMail = "tronglt@uit.edu.vn";

  async function onSubmit(values: any) {
    try {
      console.log({
        nameGroup: values.nameGroup,
        studentList: selectedStudents,
      });

      const newData: InternInfoItem = {
        STT: (dataTable.length + 1).toString(),
        isDeleted: false,
        data: {
          MSSV: mockParamsStudentCode,
          "Họ và tên": mockParamsStudentName,
          Email: mockParamsStudentMail,
          "GV hướng dẫn": mockParamsTeacherName,
          "Thông tin liên lạc": mockParamsTeacherMail,
          "Nơi thực tập": company,
          "Nội dung thực tập": internContent,
          "Vị trí thực tập": internTitleJob,
          "Ngày bắt đầu": formatDayToDataIntable(startDate),
          "Ngày kết thúc": formatDayToDataIntable(endDate),
        },
      };

      if (isAlreadyEnterInternInfo) {
        // Cập nhật dữ liệu đã có
        setDataTable((prev) =>
          prev.map((item) =>
            item.data.MSSV === mockParamsStudentCode ? newData : item
          )
        );
      } else {
        // Thêm dữ liệu mới
        setDataTable((prev) => [...prev, newData]);
      }

      toast({
        title:
          isShowDialog === Action.create
            ? "Điền thông tin thực tập  thành công."
            : "Sửa thông tin thực tập thành công.",
        variant: "success",
        duration: 3000,
      });

      setIsAlreadyEnterInternInfo(true);
      setIsShowDialog(Action.none);

      // ? không cần reset để lần sau có thể chỉnh sửa
      // reset({
      //   nameGroup: "",
      // });
    } catch {
    } finally {
    }
  }

  // ! STUDENT OUTSIDE CLASS
  const [company, setCompany] = useState("");
  const [internContent, setInternContent] = useState("");
  const [internTitleJob, setInternTitleJob] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div>
      <TitleDescription
        title="Điền thông tin thực tập"
        description={["Thời hạn: 01/02/2025 - 28/02/2025"]}
      />

      <div className="flex items-center justify-end mb-3 gap-2">
        <IconButton
          text={
            isAlreadyEnterInternInfo
              ? "Sửa thông tin thực tập"
              : "Điền thông tin thực tập"
          }
          yellow={isAlreadyEnterInternInfo ? true : false}
          green={isAlreadyEnterInternInfo ? false : true}
          iconLeft={
            isAlreadyEnterInternInfo
              ? "/assets/icons/edit.svg"
              : "/assets/icons/add.svg"
          }
          iconWidth={22}
          iconHeight={22}
          onClick={
            isAlreadyEnterInternInfo
              ? () => setIsShowDialog(Action.edit)
              : () => setIsShowDialog(Action.create)
          }
        />
      </div>

      <InternInfoTable
        isAlreadyRegisteredGroup={false}
        isEditTable={false}
        isMultipleDelete={false}
        dataTable={dataTable}
      />

      <AlertDialog open={isShowDialog !== Action.none}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className=" text-lg font-semibold text-center">
              {isShowDialog === Action.create
                ? "Điền thông tin thực tập"
                : "Sửa thông tin thực tập"}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-10">
                  {/* Nơi thực tập */}
                  <FormField
                    control={form.control}
                    name="company1"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                          Nơi thực tập <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl className="mt-3.5 ">
                          <div className="mt-6">
                            <div>
                              <Input
                                value={company}
                                onChange={(event) => {
                                  setCompany(event.target.value);
                                }}
                                name="studentIdRef"
                                placeholder={"Nơi thực tập"}
                                className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[46px] border"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Nội dung thực tập */}
                  <FormField
                    control={form.control}
                    name="internContent1"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                          Nội dung thực tập{" "}
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl className="mt-3.5 ">
                          <div className="mt-6">
                            <div>
                              <Input
                                value={internContent}
                                onChange={(event) => {
                                  setInternContent(event.target.value);
                                }}
                                name="studentIdRef"
                                placeholder={"Nội dung thực tập"}
                                className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[46px] border"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Vị trí thực tập */}
                  <FormField
                    control={form.control}
                    name="internTitleJob1"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                          Vị trí thực tập{" "}
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl className="mt-3.5 ">
                          <div className="mt-6">
                            <div>
                              <Input
                                value={internTitleJob}
                                onChange={(event) => {
                                  setInternTitleJob(event.target.value);
                                }}
                                name="studentIdRef"
                                placeholder={"Vị trí thực tập"}
                                className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[46px] border"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Ngày bắt đầu */}
                  <FormField
                    control={form.control}
                    name="startDate1"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                          Ngày bắt đầu <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl className="mt-3.5 ">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={` flex items-center text-center font-normal ${
                                  !startDate && "text-muted-foreground"
                                } hover:bg-transparent active:bg-transparent rounded-lg shadow-none`}
                              >
                                <span
                                  className={`flex-grow text-center ${
                                    !startDate && "text-muted-foreground"
                                  }`}
                                >
                                  {startDate
                                    ? format(startDate, "dd/MM/yyyy")
                                    : "Chọn ngày"}
                                </span>
                                <CalendarIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                                locale={vi}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Ngày kết thúc */}
                  <FormField
                    control={form.control}
                    name="endDate1"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                          Ngày kết thúc <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl className="mt-3.5 ">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={` flex items-center text-center font-normal ${
                                  !endDate && "text-muted-foreground"
                                } hover:bg-transparent active:bg-transparent rounded-lg shadow-none`}
                              >
                                <span
                                  className={`flex-grow text-center ${
                                    !endDate && "text-muted-foreground"
                                  }`}
                                >
                                  {endDate
                                    ? format(endDate, "dd/MM/yyyy")
                                    : "Chọn ngày"}
                                </span>
                                <CalendarIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                                locale={vi}
                              />
                            </PopoverContent>
                          </Popover>
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

                    {/* //! FAKE API */}
                    <IconButton
                      text={"Đồng ý"}
                      onClick={() => {
                        onSubmit({});
                      }}
                    />
                    {/* <SubmitButton text={"Đồng ý"} /> */}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageGroup;
