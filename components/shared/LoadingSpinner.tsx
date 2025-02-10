const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-5 h-5 border-4 border-[#5D87FF19] border-t-[#5D87FF] rounded-full animate-spin"></div>
      <span className="mt-2 text-xs text-[#5D87FF]">Đang tải file lên...</span>
    </div>
  );
};

export default LoadingSpinner;
