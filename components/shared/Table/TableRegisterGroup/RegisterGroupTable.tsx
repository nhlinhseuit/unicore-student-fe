import { tableTheme } from "@/components/shared/Table/components/DataTable";
import { itemsPerPageRegisterTable } from "@/constants";
import { RegisterGroupDataItem } from "@/types/entity/GroupRegister";
import { Table } from "flowbite-react";
import { useMemo, useState } from "react";
import NoResult from "../../Status/NoResult";
import MyFooter from "../components/MyFooter";
import RowRegisterGroupTable from "./RowRegisterGroupTable";

interface DataTableParams {
  dataTable: RegisterGroupDataItem[];
}

const RegisterGroupTable = (params: DataTableParams) => {
  const dataTable = useMemo(() => {
    return params.dataTable.filter((dataItem) => dataItem.isDeleted !== true);
  }, [params.dataTable]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isShowFooter, setIsShowFooter] = useState(true);
  const totalItems = dataTable.length;

  const currentItems = useMemo(() => {
    return dataTable.slice(
      (currentPage - 1) * itemsPerPageRegisterTable,
      currentPage * itemsPerPageRegisterTable
    );
  }, [dataTable, currentPage]);

  return (
    <div>
      {/* TABLE */}
      {currentItems.length === 0 ? (
        <NoResult
          title="Không có dữ liệu!"
          description="💡 Chưa có nhóm nào được đăng ký!"
        />
      ) : (
        <div
          className="
          scroll-container 
          overflow-auto
          max-w-full
          h-fit
          rounded-lg
          border-[1px]
          border-secondary-200
          "
        >
          <Table hoverable theme={tableTheme}>
            {/* HEADER */}
            <Table.Head
              theme={tableTheme?.head}
              className="sticky top-0 z-10 uppercase border-b bg-gray"
            >
              <Table.HeadCell
                theme={tableTheme?.head?.cell}
                className={` w-10 border-r-[1px] uppercase`}
              >
                STT
              </Table.HeadCell>

              {Object.keys(currentItems[0]?.data || {}).map((key) => {
                if (key === "Mã nhóm") return null;

                return (
                  <Table.HeadCell
                    key={key}
                    theme={tableTheme?.head?.cell}
                    className={`px-2 py-4 border-r-[1px] uppercase whitespace-nowrap`}
                  >
                    {key}
                  </Table.HeadCell>
                );
              })}
            </Table.Head>

            {/* BODY */}
            <Table.Body className="text-left divide-y">
              {currentItems.map((dataItem, index) =>
                dataItem.isDeleted ? (
                  <></>
                ) : (
                  // {/* //TODO: Main Row: Leader */}
                  <RowRegisterGroupTable
                    key={dataItem.STT}
                    dataItem={dataItem}
                  />
                )
              )}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* FOOTER */}
      {!isShowFooter ? (
        <></>
      ) : (
        <MyFooter
          currentPage={currentPage}
          itemsPerPage={itemsPerPageRegisterTable}
          totalItems={totalItems}
          onPageChange={(newPage) => setCurrentPage(newPage)} //HERE
        />
      )}
    </div>
  );
};

export default RegisterGroupTable;
