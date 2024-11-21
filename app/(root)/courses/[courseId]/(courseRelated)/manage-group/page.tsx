"use client";

import IconButton from "@/components/shared/Button/IconButton";
import RegisterGroupTable from "@/components/shared/Table/TableRegisterGroup/RegisterGroupTable";
import {
  mockDataStudentRegisterGroup,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Action } from "@/constants";

const ManageGroup = () => {
  const [isAlreadyRegisteredGroup, setIsAlreadyRegisteredGroup] =
    useState(false);
  const [isShowDialog, setIsShowDialog] = useState(Action.none);
  // ? API: Ban đầu mockTopicRegisterGroupDataTable là thông tin đki nhóm > khi đki thì gọi API và data local giữ nguyên
  const [mockDataState, setMockDataState] = useState(
    mockTopicRegisterGroupDataTable
  );

  const mockDataRef = useRef(mockDataState);

  const updateMockDataRef = (newData: any) => {
    mockDataRef.current = newData;
  };

  const AnnoucementSchema = z.object({
    nameGroup: z
      .string()
      .min(1, { message: "Bạn phải điền tên nhóm" })
      .max(100, { message: "Tên nhóm chứa tối đa 100 ký tự" }),
  });

  const form = useForm<z.infer<typeof AnnoucementSchema>>({
    resolver: zodResolver(AnnoucementSchema),
    defaultValues: {
      nameGroup: "",
    },
  });

  async function onSubmit(values: any) {
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

  const { reset } = form;

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
          iconWidth={16}
          iconHeight={16}
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
                      setIsShowDialog(Action.none);
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
              </form>
            </Form>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageGroup;
