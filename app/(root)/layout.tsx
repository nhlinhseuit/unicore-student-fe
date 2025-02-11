"use client";

import GlobalLoading from "@/components/shared/GlobalLoading";
import LeftSideBar from "@/components/shared/Sidebar/LeftSideBar";
import { Toaster } from "@/components/ui/toaster";
import { useAtomValue } from "jotai";
import React from "react";
import { isLoadingUpFileAtom } from "./courses/(courses)/(store)/courseStore";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isBrowser = () => typeof window !== "undefined";
  const isLoadingUpFile = useAtomValue(isLoadingUpFileAtom);

  return (
    <main
      className="
  background-light850_dark100 
  relative"
    >
      {/* NAVBAR */}
      {/* <Navbar /> */}

      <div className="relative flex">
        {/* SCROLL TO TOP */}
        {/* <div className="absolute bottom-4 right-4 z-50 translate-x-[50% sticky]">
          <IconButton
            text="Top"
            iconWidth={16}
            iconHeight={16}
            onClick={() => {
              // if (!isBrowser()) return;
              const teachersTable = document.getElementById("teachers-data-table");
              if (teachersTable) {
                teachersTable.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          />
        </div> */}

        {/* LEFT SIDEBAR */}
        <LeftSideBar />

        {/* CONTENT */}
        <section
          className="
       overflow-auto max-h-screen flex min-h-screen flex-1 flex-col px-6 pb-6 max-md:pb-14 sm:px-8"
        >
          <div className="w-full">{children}</div>
        </section>

        {/* TOAST */}
        <div className="fixed top-10 right-10 z-50">
          <Toaster />
        </div>
        {isLoadingUpFile ? <GlobalLoading /> : null}
      </div>

      {/* Toaster */}
    </main>
  );
};

export default Layout;
