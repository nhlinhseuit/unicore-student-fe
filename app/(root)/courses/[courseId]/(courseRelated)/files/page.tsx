"use client";

import FileDataTable from "@/components/shared/Table/TableFile/FileDataTable";
import { mockFileDataTable } from "@/mocks";

const Files = () => {
  return (
    <FileDataTable
      isEditTable={false}
      // @ts-ignore
      dataTable={mockFileDataTable}
     
    />
  );
};

export default Files;
