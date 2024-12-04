import React from "react";

// Định nghĩa props cho component
interface CancelButtonFormProps {
  onClick: () => void;
}

const CancelButtonForm = ({ onClick }: CancelButtonFormProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-9 px-4 py-2 mt-2 sm:mt-0"
    >
      Hủy
    </button>
  );
};

export default CancelButtonForm;
