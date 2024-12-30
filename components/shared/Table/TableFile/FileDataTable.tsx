
import { itemsPerPageTopicTable } from "@/constants";
import { FileDataItem } from "@/types";
import { Table } from "flowbite-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import IconButton from "../../Button/IconButton";
import { tableTheme } from "../components/DataTable";
import MyFooter from "../components/MyFooter";
import RowFileDataTable from "./RowFileDataTable";

interface DataTableParams {
  isEditTable: boolean;
  dataTable: FileDataItem[];
  isOnlyView?: boolean;
}

const FileDataTable = (params: DataTableParams) => {
  const dataTable = useMemo(() => {
    return params.dataTable.filter((dataItem) => dataItem.isDeleted !== true);
  }, [params.dataTable]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isShowFooter, setIsShowFooter] = useState(true);
  const [itemsSelected, setItemsSelected] = useState<string[]>([]);
  const [isShowDialog, setIsShowDialog] = useState(-1);
  const totalItems = dataTable.length;

  const [isShowDeleteInfo, setIsShowDeleteInfo] = useState(false);
  useEffect(() => {
    if (itemsSelected.length > 0) {
      if (!isShowDeleteInfo) setIsShowDeleteInfo(true);
    } else {
      if (isShowDeleteInfo) setIsShowDeleteInfo(false);
    }
  }, [itemsSelected]);

  const currentItems = useMemo(() => {
    return dataTable.slice(
      (currentPage - 1) * itemsPerPageTopicTable,
      currentPage * itemsPerPageTopicTable
    );
  }, [dataTable, currentPage]);

  return (
    <div>
      {isShowDeleteInfo ? (
        <div className="flex mb-3 justify-end items-center gap-2">
          <p className="text-sm font-medium">
            Đã chọn:
            <span className="font-semibold">{` ${itemsSelected.length}`}</span>
          </p>
          <IconButton
            text="Tải xuống"
            onClick={() => {}}
            iconLeft={"/assets/icons/download-white.svg"}
            iconWidth={16}
            iconHeight={16}
          />
          <IconButton
            text="Thoát"
            onClick={() => {
              setItemsSelected([]);
            }}
            bgColor="bg-gray-500"
          />
        </div>
      ) : (
        <div className="flex justify-end mb-3 gap-2">
          <IconButton
            text="Tải lên"
            green
            onClick={() => {}}
            iconLeft={"/assets/icons/upload-white.svg"}
            iconWidth={16}
            iconHeight={16}
          />

          <IconButton
            text="Tải xuống"
            onClick={() => {}}
            iconLeft={"/assets/icons/download-white.svg"}
            iconWidth={16}
            iconHeight={16}
          />
        </div>
      )}

      {/* TABLE */}
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
            ></Table.HeadCell>

            <Table.HeadCell
              theme={tableTheme?.head?.cell}
              className={` w-10 border-r-[1px] uppercase`}
            >
              STT
            </Table.HeadCell>

            <Table.HeadCell
              theme={tableTheme?.head?.cell}
              className={`w-16 border-r-[1px] uppercase !py-0 !my-0`}
            >
              <div className="flex-center">
                <Image
                  src="/assets/icons/file.svg"
                  alt="search"
                  width={24}
                  height={24}
                />
              </div>
            </Table.HeadCell>

            {Object.keys(currentItems[0]?.data || {}).map((key, index) => {
              return (
                <Table.HeadCell
                  key={`${key}_${index}`}
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
            {currentItems.map((dataItem, index) => {
              var valueUniqueInput = dataItem.STT;

              return dataItem.isDeleted ? (
                <></>
              ) : (
                <RowFileDataTable
                  key={dataItem.STT}
                  dataItem={dataItem}
                  isOnlyView={params.isOnlyView}
                  valueUniqueInput={valueUniqueInput.toString()}
                  itemsSelected={itemsSelected}
                  onClickCheckBoxSelect={(item: string) => {
                    setItemsSelected((prev) => {
                      if (prev.includes(item)) {
                        return prev.filter((i) => i !== item);
                      } else {
                        return [...prev, item];
                      }
                    });
                  }}
                />
              );
            })}
          </Table.Body>
        </Table>
      </div>

      {/* FOOTER */}
      {!isShowFooter || params.isEditTable ? (
        <></>
      ) : (
        <MyFooter
          currentPage={currentPage}
          itemsPerPage={itemsPerPageTopicTable}
          totalItems={totalItems}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      )}

     
    </div>
  );
};

export default FileDataTable;
