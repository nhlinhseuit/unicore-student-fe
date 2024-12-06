"use client";

import IconButton from "@/components/shared/Button/IconButton";
import RegisterGroupTable from "@/components/shared/Table/TableRegisterGroup/RegisterGroupTable";
import { mockDataStudentRegisterGroup, mockDbStudent } from "@/mocks";
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

import BorderContainer from "@/components/shared/BorderContainer";
import SubmitButton from "@/components/shared/Button/SubmitButton";
import StudentItem from "@/components/shared/StudentItem";
import { Action, maxStudentPerGroup, minStudentPerGroup } from "@/constants";
import { toast } from "@/hooks/use-toast";
import Student from "@/types/entity/Student";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ManageGroup = () => {
  const pathName = usePathname();
  const courseId = pathName.split("/")[2];

  const [isAlreadyRegisteredGroup, setIsAlreadyRegisteredGroup] =
    useState(false);

  const [isShowDialog, setIsShowDialog] = useState(Action.none);

  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  const AnnoucementSchema = z
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

  const form = useForm<z.infer<typeof AnnoucementSchema>>({
    resolver: zodResolver(AnnoucementSchema),
    defaultValues: {
      nameGroup: "",
      studentList: "",
    },
  });

  async function onSubmit(values: any) {
    try {
      console.log({
        nameGroup: values.nameGroup,
        studentList: selectedStudents,
      });

      toast({
        title:
          isShowDialog === Action.create
            ? "Đăng ký nhóm thành công."
            : "Sửa thông tin nhóm thành công.",
        variant: "success",
        duration: 3000,
      });

      setIsAlreadyRegisteredGroup(true);
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

  return (
    <div className="px-6">
      <div className="flex items-center justify-end mb-3 gap-2">
        <p className="italic text-sm text-red-500">
          * Nhóm trưởng điền tên đầu tiên
        </p>

        <IconButton
          text={
            isAlreadyRegisteredGroup ? "Sửa thông tin nhóm" : "Đăng ký nhóm"
          }
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
              ? () => setIsShowDialog(Action.edit)
              : () => setIsShowDialog(Action.create)
          }
        />
      </div>

      <RegisterGroupTable
        isEditTable={false}
        isMultipleDelete={false}
        dataTable={mockDataStudentRegisterGroup}
      />

      <AlertDialog open={isShowDialog !== Action.none}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className=" text-lg font-semibold text-center">
              {isShowDialog === Action.create
                ? "Đăng ký nhóm"
                : "Sửa thông tin nhóm"}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-10">
                  <FormField
                    control={form.control}
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
                          Nhóm trưởng điền tên đầu tiên. Thành viên nhóm phải là
                          sinh viên của lớp hiện tại.
                        </FormDescription>

                        {/* //!: API setting của lớp học để hiển thị cái này */}
                        <FormDescription className="body-regular mt-2.5 text-light-500">
                          Hoặc thành viên nhóm có thể là sinh viên khác lớp,
                          nhưng phải cùng giảng viên giảng dạy và cùng môn học.
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
                                              selectedStudents={
                                                selectedStudents
                                              }
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
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageGroup;
