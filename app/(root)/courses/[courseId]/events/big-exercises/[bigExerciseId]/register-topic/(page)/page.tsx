"use client";

import IconButton from "@/components/shared/Button/IconButton";
import {
  mockDataStudentRegisterTopic,
  mockDbStudent,
  mockTeacherList,
} from "@/mocks";
import { useEffect, useRef, useState } from "react";

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
import {
  Action,
  maxStudentPerGroup,
  minStudentPerGroup,
  RegisterTopicTableType,
} from "@/constants";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import Image from "next/image";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { sSelectedTopic } from "../(store)/createReportStore";
import RegisterTopicTable from "../RegisterTopicTable";
import BorderContainer from "@/components/shared/BorderContainer";
import StudentItem from "@/components/shared/StudentItem";
import { usePathname } from "next/navigation";
import Student from "@/types/entity/Student";
import SubmitButton from "@/components/shared/Button/SubmitButton";

const RegisterTopic = () => {
  // Update biến: Danh sách thành viên nhóm

  const pathName = usePathname();
  const courseId = pathName.split("/")[2];

  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

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

  //!: API trả về có kq

  const isHasStudentInDb = () => {
    if (studentIdRef.current) {
      return mockDbStudent.find(
        (item) => item.id === studentIdRef.current!.value
      );
    }
  };

  //!: API check xem sinh viên có thỏa điều kiện sinh viên khác lớp, nhưng phải cùng giảng viên giảng dạy và cùng môn học?

  const isStudentAbleToBeMemberGroup = () => {
    for (const student of selectedStudents) {
      if (student.class === "SE502.N25") return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateStudentId(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (isHasStudentInDb()) {
        setSuggestion(true);
      } else {
        setSuggestion(false);
      }
    }, 300);
  };

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
    if (isHasStudentInDb()) {
      setSuggestion(true); // Hiển thị gợi ý nếu khớp
    } else {
      setSuggestion(false); // Ẩn gợi ý nếu không khớp
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setSuggestion(false); // Tắt suggestion khi click ra ngoài
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //
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

  const getRegisterdTopicName = () => {
    return mockDataStudentRegisterTopic.find(
      (item) => item.data["Tên đề tài"] === selectedTopic
    )?.data["Tên đề tài"];
  };

  const RegisterTopicSchema = z
    .object({
      nameGroup: z
        .string()
        .min(1, { message: "Bạn phải điền tên nhóm" })
        .max(100, { message: "Tên nhóm chứa tối đa 100 ký tự" }),
      studentList: z.string().optional(),
    })
    .refine(() => selectedStudents.length >= minStudentPerGroup, {
      message: `Nhóm phải có ít nhất ${minStudentPerGroup} thành viên.`,
      path: ["studentList"],
    })
    .refine(() => selectedStudents.length <= maxStudentPerGroup, {
      message: `Nhóm chỉ được phép tối đa ${maxStudentPerGroup} thành viên.`,
      path: ["studentList"],
    })
    .refine(() => isStudentAbleToBeMemberGroup(), {
      message: `Thành viên nhóm có thể là sinh viên khác lớp, nhưng phải cùng giảng viên giảng dạy và cùng môn học.`,
      path: ["studentList"],
    });

  const SuggestTopicSchema = z
    .object({
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
      studentList: z.string().optional(),
    })
    .refine(() => selectedStudents.length >= minStudentPerGroup, {
      message: `Nhóm phải có ít nhất ${minStudentPerGroup} thành viên.`,
      path: ["studentList"],
    })
    .refine(() => selectedStudents.length <= maxStudentPerGroup, {
      message: `Nhóm chỉ được phép tối đa ${maxStudentPerGroup} thành viên.`,
      path: ["studentList"],
    })
    .refine(() => isStudentAbleToBeMemberGroup(), {
      message: `Thành viên nhóm có thể là sinh viên khác lớp, nhưng phải cùng giảng viên giảng dạy và cùng môn học.`,
      path: ["studentList"],
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
      });

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
        setIsAlreadyRegisteredGroup(true);
      }

      // ? không cần reset để lần sau có thể chỉnh sửa khi đki thông tin đề tài
      // reset({
      //   nameGroup: "",
      // });
    } catch {
    } finally {
    }
  }

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
                {!isShowDialogSuggestTopic && isAlreadyRegisteredGroup ? (
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
                        setIsAlreadyRegisteredGroup(false);
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
                                        ? mockTeacherList[
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
                                {mockTeacherList.map((teacher, index) => (
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
                                      {selectedTeacherSuggest === teacher.id ? (
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
                <FormField
                  control={renderForm.control}
                  // @ts-ignore
                  name="studentList"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel className="text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                        Danh sách thành viên nhóm{" "}
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormDescription className="body-regular mt-2.5 text-light-500">
                        Nhóm trưởng điền tên đầu tiên. Thành viên nhóm phải là
                        sinh viên của lớp hiện tại.
                      </FormDescription>

                      {/* //!: API setting của lớp học để hiển thị cái này */}
                      <FormDescription className="body-regular mt-2.5 text-light-500">
                        Hoặc thành viên nhóm có thể là sinh viên khác lớp, nhưng
                        phải cùng giảng viên giảng dạy và cùng môn học.
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
                                  {isHasStudentInDb()?.id} -{" "}
                                  {isHasStudentInDb()?.name} -{" "}
                                  {isHasStudentInDb()?.class}
                                </div>
                              )}
                            </div>
                            {selectedStudents.length > 0 ? (
                              <BorderContainer otherClasses="mt-3">
                                <div className="my-4 ml-4">
                                  {selectedStudents && (
                                    <div className="flex flex-col gap-4">
                                      {selectedStudents.map((item, index) => (
                                        <div key={item.id}>
                                          <StudentItem
                                            item={item}
                                            index={index}
                                            courseId={courseId}
                                            selectedStudents={selectedStudents}
                                            setSelectedStudents={
                                              setSelectedStudents
                                            }
                                          />
                                        </div>
                                      ))}
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

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
                  <IconButton
                    cancel
                    text={"Hủy"}
                    onClick={() => {
                      if (isShowDialogSuggestTopic)
                        setIsShowDialogSuggestTopic(false);
                      else setIsShowDialogRegisterTopic(Action.none);
                    }}
                  />
                  <SubmitButton text={"Đồng ý"} />
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
