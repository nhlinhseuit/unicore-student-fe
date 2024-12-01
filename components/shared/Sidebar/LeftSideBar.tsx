"use client";

import MyAccount from "@/components/shared/MyAccount";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StudentCoursesTabItems, sidebarStudentLinks } from "@/constants";
import { mockNotiLists } from "@/mocks";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import Divider from "../Divider";
import NotiItem from "../NotiItem";
import UnreadContainer from "../UnreadContainer";

const LeftSideBar = () => {
  const pathName = usePathname();
  const isLoggedIn = true;

  const isOriginalRoute = () => {
    // TODO: MỚI SỬA CODE TỪ LUỒNG STUDENT
    // TODO: XEM LẠI CHỖ NÀY
    return StudentCoursesTabItems.find((item) => {
      if (item.route === "/courses") {
        return undefined;
      } else {
        return pathName.includes(item.route);
      }
    });
  };

  const getCourseId = () => {
    let courseId;
    // * ROUTE CỦA SUB COURSE: courses/SE114.O12.PMCL
    if (!isOriginalRoute() && pathName.includes("courses/")) {
      const parts = pathName.split("/");
      const coursesIndex = parts.indexOf("courses");

      if (coursesIndex !== -1 && parts[coursesIndex + 1]) {
        courseId = parts[coursesIndex + 1];
      }
      return courseId;
    }
  };

  let getCoursesStyle = (isActive: boolean) => {
    return `${
      isActive
        ? "primary-gradient rounded-lg text-light-900"
        : "text-dark300_light900"
    }  flex items-center justify-start gap-4
                    max-lg:w-[52px]
                    bg-transparent px-4 py-3`;
  };

  let getStyle = (isActive: boolean) => {
    return `${
      isActive
        ? "primary-gradient text-light-900"
        : "text-dark300_light900 hover:bg-[#ECF2FFFF] hover:!text-[#5D87FFFF]"
    }  flex items-center justify-start gap-4
    group rounded-lg max-lg:w-[52px]
    bg-transparent px-4 py-3`;
  };

  return (
    <section
    className="
      flex flex-col
      background-light900_dark200
      min-w-[250px]
      max-w-[250px]
      max-lg:min-w-fit
      max-h-screen
      z-50
      max-sm:hidden
      pt-4
      border-r
      shadow-light-300
      dark:shadow-none
  "
    >
      {/* LOGO */}
      <div className="px-4 mb-2 ml-2 flex-shrink-0">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src={"/assets/images/site-logo.svg"}
            width={23}
            height={23}
            alt="DevFlow"
          />

          <p className="ml-1 h1-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-lg:hidden">
            Uni<span className="text-primary-500 ml-[2px]">Core</span>
          </p>
        </Link>
      </div>

      {/* NỘI DUNG CUỘN */}
      <div className="
      flex flex-col
      gap-4
      px-6
      mt-2
      overflow-y-auto
      flex-grow
      custom-scrollbar
    ">
        {/* ITEM */}
        {sidebarStudentLinks.map((item, index) => {
          let isActive;
          // TODO: handle cho tab HOME
          if (
            (pathName === "/create-announcement" ||
              pathName.startsWith("/announcements")) &&
            item.route === "/"
          ) {
            isActive = true;
          } else {
            isActive =
              (pathName.startsWith(item.route) && item.route.length > 1) ||
              pathName === item.route;
          }

          if (item.route !== "/profile") {
            if (item.route === "/courses" && getCourseId()) {
              isActive = true;

              return (
                <Fragment key={`${index}_${item.route}`}>
                  <Link href={item.route} className={getCoursesStyle(isActive)}>
                    <Image
                      src={item.imgURL}
                      alt={item.label}
                      width={20}
                      height={20}
                      className={`${isActive ? "" : "invert-colors"}`}
                    />
                    <p
                      className={`${isActive ? "normal-bold" : "normal-medium"} 
                      max-lg:hidden
                  `}
                    >
                      {item.label}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="primary-gradient w-[6px] h-full rounded-sm ml-1"></div>
                    <p className="body-semibold text-right cursor-pointer text-primary-500 line-clamp-1">
                      {getCourseId()}
                    </p>
                  </div>
                </Fragment>
              );
            } else {
              return (
                <Link
                  key={item.route}
                  href={item.route}
                  className={getStyle(isActive)}
                >
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    width={20}
                    height={20}
                    className={`${isActive ? "" : "invert-colors"}`}
                  />
                  <p
                    className={`${isActive ? "normal-bold" : "normal-medium"} 
                max-lg:hidden
            `}
                  >
                    {item.label}
                  </p>
                </Link>
              );
            }
          }
        })}
      </div>

      {isLoggedIn ? (
        <div className="mb-2 px-2 flex gap-2 items-center justify-between flex-shrink-0">
          <MyAccount textAvatar="HL" name="Nguyễn Hoàng Linh" />

          <Popover>
            <PopoverTrigger className="p-2">
              <div className="relative bg-primary-500 rounded-full p-2 w-[30px] h-[30px] flex justify-center items-center">
                <Image
                  src="/assets/icons/noti-white.svg"
                  width={14}
                  height={14}
                  alt="noti"
                />

                <UnreadContainer unread={1} />
              </div>
            </PopoverTrigger>

            <PopoverContent
              className="
                w-[calc((100vw-200px)*0.6)]
                bg-white 
                shadow-2xl
                rounded-xl 
                overflow-y-auto 
                h-[calc(100vh-60px)]
                scroll-container
              "
              side="right"
              align="end"
              sideOffset={20}
            >
              <div>
                <p className="small-regular cursor-pointer flex justify-end">
                  Đánh dấu đã đọc tất cả
                </p>
                <Divider otherClasses="mt-2 mb-4 !h-[1.3px] !bg-gray-200" />
                {mockNotiLists.map((noti, index) => (
                  <>
                    <NotiItem
                      key={noti._id}
                      _id={noti._id}
                      title={noti.title}
                      description={noti.description}
                      tags={noti.tags}
                      createdAt={noti.createdAt}
                    />

                    {index !== mockNotiLists.length - 1 ? (
                      <Divider otherClasses="mt-2 mb-2 !h-[1.3px] !bg-gray-200" />
                    ) : null}
                  </>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="absolute bottom-0 flex flex-col gap-3 mx-6 mt-6 mb-6 ">
          {/* <SignedOut>
        </SignedOut> */}
          <Link
            href="/sign-in"
            className="flex rounded-lg background-light800_dark400 "
          >
            <Button
              className="
                        small-medium btn-secondary 
                        min-h-[41px] w-full rounded-lg
                        px-4 py-3 shadow-none
                        max-lg:hidden
                        "
            >
              <span className=" max-lg:hidden primary-text-gradient">
                Đăng nhập
              </span>
            </Button>
            <Image
              src="/assets/icons/account.svg"
              alt="login"
              width={20}
              height={20}
              className="
                invert-colors 
                max-lg:w-[52px]
                bg-transparent p-4
                lg:hidden"
            />
          </Link>

          <Link
            href="/sign-up"
            className="flex rounded-lg background-light700_dark300"
          >
            <Button
              className="
                        small-medium btn-tertiary light-border-2 
                        min-h-[41px] w-full rounded-lg
                        px-4 py-3 shadow-none text-dark400_light900
                        max-lg:hidden"
            >
              Đăng ký
            </Button>

            <Image
              src="/assets/icons/sign-up.svg"
              alt="signup"
              width={20}
              height={20}
              className="
                invert-colors 
                max-lg:w-[52px]
                bg-transparent p-4
                lg:hidden"
            />
          </Link>
        </div>
      )}
    </section>
  );
};

export default LeftSideBar;

// dark:shadow-none
