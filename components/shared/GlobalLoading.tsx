import React from "react";

const GlobalLoading = () => {
  return (
    <div className="fixed top-4 right-4 flex items-center justify-center bg-white rounded-lg p-4 shadow-lg border border-[#5D87FF] z-50">
      <div className="w-6 h-6 border-4 border-[#5D87FF19] border-t-[#5D87FF] rounded-full animate-spin mr-4"></div>
      <p className="text-[#5D87FF] text-sm font-semibold">
        Đang tải file lên, vui lòng chờ...
      </p>
    </div>
  );
};

export default GlobalLoading;
