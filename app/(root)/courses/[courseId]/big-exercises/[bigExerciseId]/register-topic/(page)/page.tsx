"use client";

import IconButton from "@/components/shared/Button/IconButton";
import {
  mockDataStudentRegisterTopic,
  mockTeacherGradingList,
  mockTopicRegisterGroupDataTable,
} from "@/mocks";
import { useRef, useState } from "react";

import MiniButton from "@/components/shared/Button/MiniButton";
import TopicRegisterGroupDataTable from "@/components/shared/Table/TableRegisterStudent/TopicRegisterGroupDataTable";
import {
  AlertDialog,
  AlertDialogContent,
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
import { Dropdown } from "flowbite-react";

import TableSearch from "@/components/shared/Search/TableSearch";
import ErrorComponent from "@/components/shared/Status/ErrorComponent";
import { Action, RegisterTopicTableType } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import Image from "next/image";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { sSelectedTopic } from "../(store)/createReportStore";
import RegisterTopicTable from "../RegisterTopicTable";

const RegisterTopic = () => {
  const [errorMessages, setErrorMessages] = useState<string[]>([
    "MSSV 21522289 - Nguyễn Hoàng Linh xuất hiện ở 2 nhóm STT 1 và STT 2",
  ]);

  const [isAlreadyRegisteredGroup, setIsAlreadyRegisteredGroup] =
    useState(false);
  const [isShowDialogRegisterTopic, setIsShowDialogRegisterTopic] = useState(
    Action.none
  );
  const [isShowDialogSuggestTopic, setIsShowDialogSuggestTopic] =
    useState(false);

  const [selectedTeacherSuggest, setSelectedTeacherSuggest] = useState(-1);

  const selectedTopic = sSelectedTopic.use();

  // ? API: Ban đầu mockTopicRegisterGroupDataTable là thông tin đki nhóm > khi đki thì gọi API và data local giữ nguyên
  const [mockDataState, setMockDataState] = useState(
    mockTopicRegisterGroupDataTable
  );

  const mockDataRef = useRef(mockDataState);

  const updateMockDataRef = (newData: any) => {
    mockDataRef.current = newData;
  };

  const getRegisterdTopicName = () => {
    return mockDataStudentRegisterTopic.find(
      (item) => item.data["Tên đề tài"] === selectedTopic
    )?.data["Tên đề tài"];
  };

  const RegisterTopicSchema = z.object({
    nameGroup: z
      .string()
      .min(1, { message: "Bạn phải điền tên nhóm" })
      .max(100, { message: "Tên nhóm chứa tối đa 100 ký tự" }),
  });

  const SuggestTopicSchema = z.object({
    title: z
      .string()
      .min(5, { message: "Tên đề tài phải chứa ít nhất 5 ký tự" })
      .max(130),
    description: z
      .string()
      .min(20, { message: "Nội dung đề tài phải chứa ít nhất 20 ký tự" }),
    nameGroup: z
      .string()
      .min(1, { message: "Bạn phải điền tên nhóm" })
      .max(100, { message: "Tên nhóm chứa tối đa 100 ký tự" }),
    teacherSuggest: z.any().optional(),
  });

  const formRegisterTopic = useForm<z.infer<typeof RegisterTopicSchema>>({
    resolver: zodResolver(RegisterTopicSchema),
    defaultValues: {
      nameGroup: "",
    },
  });

  const formSuggestTopic = useForm<z.infer<typeof SuggestTopicSchema>>({
    resolver: zodResolver(SuggestTopicSchema),
    defaultValues: {
      nameGroup: "",
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: any) {
    console.log("onSubmit");
    try {
      console.log({
        nameGroup: values.nameGroup,
        dataRef: mockDataRef,
        dataState: mockDataState,
      });

      // ? Để có thể chỉnh sửa được
      // setMockDataState(mockTopicRegisterGroupDataTable);
      // updateMockDataRef(mockDataState);

      // naviate to home page
      // router.push("/");

      toast({
        title: isShowDialogSuggestTopic
          ? "Đề xuất đề tài thành công"
          : isShowDialogRegisterTopic === Action.create
          ? "Đăng ký nhóm thành công."
          : "Chỉnh sửa thành công.",
        variant: "success",
        duration: 3000,
      });

      setIsAlreadyRegisteredGroup(true);

      if (isShowDialogSuggestTopic) {
        resetSuggestTopicForm({
          nameGroup: "",
          title: "",
          description: "",
        });
        setIsShowDialogSuggestTopic(false);
      } else {
        console.log("setIsShowDialogRegisterTopic");
        setIsShowDialogRegisterTopic(Action.none);
      }

      // ? không cần reset để lần sau có thể chỉnh sửa khi đki thông tin đề tài
      // reset({
      //   nameGroup: "",
      // });
    } catch {
    } finally {
    }
  }

  const { reset: resetRegisterTopicForm } = formRegisterTopic;
  const { reset: resetSuggestTopicForm } = formSuggestTopic;

  const renderForm = isShowDialogSuggestTopic
    ? (formSuggestTopic as UseFormReturn<{
        nameGroup: string;
        title?: string;
        description?: string;
      }>)
    : (formRegisterTopic as UseFormReturn<{
        nameGroup: string;
      }>);

  return (
    <div className="px-6">
      {errorMessages.length > 0 && (
        <div className="mb-6">
          {errorMessages.map((item, index) => (
            <ErrorComponent
              key={`${item}_${index}`}
              text={item}
              onClickClose={() => {
                setErrorMessages((prevErrors) =>
                  prevErrors.filter((_, i) => i !== index)
                );
              }}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <TableSearch
          setSearchTerm={() => {}}
          searchTerm={""}
          otherClasses="pr-2 w-[40%]"
        />

        <div className="w-[60%] flex items-center justify-end mb-3 gap-2">
          <p className="italic text-sm text-red-500">
            * Nhóm trưởng điền tên đầu tiên
          </p>

          <IconButton
            text={isAlreadyRegisteredGroup ? "Chỉnh sửa" : "Đăng ký nhóm"}
            yellow={isAlreadyRegisteredGroup ? true : false}
            green={isAlreadyRegisteredGroup ? false : true}
            iconLeft={
              isAlreadyRegisteredGroup
                ? "/assets/icons/edit.svg"
                : "/assets/icons/add.svg"
            }
            iconWidth={22}
            iconHeight={22}
            onClick={
              isAlreadyRegisteredGroup
                ? () => {
                    setIsShowDialogRegisterTopic(Action.edit);
                  }
                : () => {
                    if (selectedTopic === "") {
                      toast({
                        title: "Bạn chưa chọn đề tài!",
                        variant: "error",
                        duration: 3000,
                      });
                      return;
                    }
                    setIsShowDialogRegisterTopic(Action.create);
                  }
            }
          />
          <IconButton
            text={"Đề xuất đề tài"}
            iconWidth={22}
            iconHeight={22}
            onClick={() => setIsShowDialogSuggestTopic(true)}
          />
        </div>
      </div>

      <RegisterTopicTable
        type={RegisterTopicTableType.registerTopic}
        isEditTable={false}
        isMultipleDelete={false}
        dataTable={mockDataStudentRegisterTopic}
      />

      {/* ĐĂNG KÝ ĐỀ TÀI */}
      <AlertDialog
        open={
          isShowDialogRegisterTopic !== Action.none || isShowDialogSuggestTopic
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className=" text-lg font-semibold text-center">
              {isShowDialogSuggestTopic
                ? "Đề xuất đề tài mới "
                : isShowDialogRegisterTopic === Action.create
                ? "Đăng ký nhóm"
                : "Chỉnh sửa"}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...renderForm}>
            <form onSubmit={renderForm.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                {isAlreadyRegisteredGroup ? (
                  <div className="flex gap-6 items-center ">
                    <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-red-900 text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                      Đề tài đã đăng ký:
                      <span className="ml-2 font-medium">
                        {getRegisterdTopicName()}
                      </span>
                    </label>
                    <IconButton
                      text={"Đổi đề tài"}
                      green
                      onClick={() => {
                        setIsShowDialogRegisterTopic(Action.none);
                        sSelectedTopic.set("");
                      }}
                    />
                  </div>
                ) : null}

                {/* Tên nhóm */}
                <FormField
                  control={renderForm.control}
                  name="nameGroup"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                        Tên nhóm <span className="text-red-600">*</span>
                      </FormLabel>
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

                {/* Thông tin đề tài */}
                {isShowDialogSuggestTopic ? (
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={renderForm.control}
                      // ! Ignore: Biết chắc chắn với biến isShowDialogSuggestTopic thì đi với formSuggest
                      // @ts-ignore
                      name="title"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                          <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                            Tên đề tài <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl className="mt-3.5 ">
                            <Input
                              {...field}
                              placeholder="Nhập tên đề tài..."
                              className="
                                no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={renderForm.control}
                      // ! Ignore: Biết chắc chắn với biến isShowDialogSuggestTopic thì đi với formSuggest
                      // @ts-ignore
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                          <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                            Mô tả đề tài <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl className="mt-3.5 ">
                            <textarea
                              {...field}
                              placeholder="Nhập mô tả..."
                              className="
                          no-focus
                          paragraph-regular
                          background-light900_dark300
                          light-border-2
                          text-dark300_light700
                          min-h-[200px]
                          rounded-md
                          border
                          resize-none
                          w-full
                          px-3
                          py-4
                          focus:outline-none
                          focus:ring-0
                          active:outline-none
                          focus:border-inherit
                          text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/*  Giảng viên đề xuất */}
                    <FormField
                      control={renderForm.control}
                      // ! Ignore: Biết chắc chắn với biến isShowDialogSuggestTopic thì đi với formSuggest
                      // @ts-ignore
                      name="teacherSuggest"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                          <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                            Giảng viên đề xuất
                          </FormLabel>
                          <FormControl className="mt-3.5 ">
                            <Dropdown
                              className="z-30 rounded-lg"
                              label=""
                              dismissOnClick={true}
                              renderTrigger={() => (
                                <div>
                                  <IconButton
                                    text={` ${
                                      selectedTeacherSuggest !== -1
                                        ? mockTeacherGradingList[
                                            selectedTeacherSuggest - 1
                                          ].value
                                        : "Chọn giảng viên"
                                    }`}
                                    onClick={() => {}}
                                    iconRight={"/assets/icons/chevron-down.svg"}
                                    bgColor="bg-white"
                                    textColor="text-black"
                                    otherClasses="w-full shadow-none no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 border "
                                  />
                                </div>
                              )}
                            >
                              <div className="scroll-container scroll-container-dropdown-content">
                                {mockTeacherGradingList.map(
                                  (teacher, index) => (
                                    <Dropdown.Item
                                      key={`${teacher.id}_${index}`}
                                      onClick={() => {
                                        if (
                                          selectedTeacherSuggest === teacher.id
                                        ) {
                                          setSelectedTeacherSuggest(-1);
                                        } else {
                                          setSelectedTeacherSuggest(teacher.id);
                                        }
                                      }}
                                    >
                                      <div className="flex justify-between w-full">
                                        <p className="w-[80%] text-left line-clamp-1">
                                          {teacher.value}
                                        </p>
                                        {selectedTeacherSuggest ===
                                        teacher.id ? (
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
                                  )
                                )}
                              </div>
                            </Dropdown>
                          </FormControl>
                          <FormDescription className="body-regular mt-2.5 text-light-500">
                            Nếu không đề xuất giảng viên thì Khoa sẽ chỉ định
                            giảng viên hướng dẫn đề tài.
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : null}

                {/* Danh sách thành viên nhóm */}
                <div className="mt-6">
                  <div>
                    <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-red-900 text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                      Danh sách thành viên nhóm
                    </label>
                    <p className="mb-4 text-[0.8rem] dark:text-slate-400 mt-2.5 body-regular text-light-500">
                      Nhóm trưởng điền tên đầu tiên.
                    </p>
                  </div>
                  <TopicRegisterGroupDataTable
                    isEditTable={false}
                    isMultipleDelete={false}
                    dataTable={mockDataRef.current}
                    onChangeTable={(newValue) => {
                      updateMockDataRef(newValue);
                    }}
                  />
                </div>

                <div className="relative flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
                  {/* mt-4 cho nên translate 7 */}
                  <div className="absolute left-[50%] -translate-y-7">
                    <MiniButton
                      key={1}
                      value={2}
                      icon={"/assets/icons/add.svg"}
                      bgColor="bg-primary-500"
                      onClick={(value) => {
                        // setSelectedMiniButton(value);

                        const newEntry = {
                          STT: (mockDataRef.current.length + 1).toString(),
                          data: {
                            MSSV: "",
                            SĐT: "",
                            "Họ và tên": "",
                          },
                        };

                        // Cập nhật mockDataRef mà không re-render `TopicRegisterGroupDataTable`
                        updateMockDataRef([...mockDataRef.current, newEntry]);

                        // Cập nhật mockDataState để re-render những phần khác trong UI
                        setMockDataState([...mockDataRef.current]);
                      }}
                      otherClasses={"w-[26px] h-[26px] mr-10"}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isShowDialogSuggestTopic)
                        setIsShowDialogSuggestTopic(false);
                      else setIsShowDialogRegisterTopic(Action.none);

                      setMockDataState(mockTopicRegisterGroupDataTable);
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-9 px-4 py-2 mt-2 sm:mt-0"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 dark:focus-visible:ring-slate-300 bg-primary-500 text-slate-50 shadow hover:bg-primary-500/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-9 px-4 py-2"
                  >
                    Đồng ý
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RegisterTopic;
