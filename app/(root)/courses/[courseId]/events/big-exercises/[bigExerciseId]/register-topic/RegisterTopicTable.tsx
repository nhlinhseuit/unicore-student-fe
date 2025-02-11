import { Table } from "flowbite-react";
import { useMemo, useState } from "react";
import RowRegisterTopicTable from "./RowRegisterTopicTable";

import NoResult from "@/components/shared/Status/NoResult";
import { tableTheme } from "@/components/shared/Table/components/DataTable";
import MyFooter from "@/components/shared/Table/components/MyFooter";
import { itemsPerPageRegisterTable, RegisterTopicTableType } from "@/constants";
import { sSelectedTopic } from "./(store)/createReportStore";
import { TopicDataItem } from "@/types/entity/Topic";

interface DataTableParams {
  type: RegisterTopicTableType;
  isAlreadyRegisteredGroup?: boolean;
  isEditTable: boolean;
  isMultipleDelete: boolean;
  dataTable: TopicDataItem[];
}

const RegisterTopicTable = (params: DataTableParams) => {
  const dataTable = useMemo(() => {
    return params.dataTable.filter((dataItem) => dataItem.isDeleted !== true);
  }, [params.dataTable]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isShowFooter, setIsShowFooter] = useState(true);
  const totalItems = dataTable.length;

  const selectedTopic = sSelectedTopic.use();

  const currentItems = useMemo(() => {
    return dataTable.slice(
      (currentPage - 1) * itemsPerPageRegisterTable,
      currentPage * itemsPerPageRegisterTable
    );
  }, [dataTable, currentPage]);

  const [filteredDataTable, setFilteredDataTable] =
    useState<TopicDataItem[]>(currentItems);

  return (
    <div>
      {/* TABLE */}
      {currentItems.length > 0 && filteredDataTable.length === 0 ? (
        <NoResult
          title="Không có dữ liệu!"
          description="💡 Bạn hãy thử tìm kiếm 1 từ khóa khác nhé."
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
              ></Table.HeadCell>

              <Table.HeadCell
                theme={tableTheme?.head?.cell}
                className={` w-10 border-r-[1px] uppercase`}
              >
                STT
              </Table.HeadCell>
              {Object.keys(filteredDataTable[0]?.data || {}).map((key) => {
                if (key === "Mã nhóm" || key === "Mã đề tài") return null;

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
              {filteredDataTable.map((dataItem, index) =>
                dataItem.isDeleted ? (
                  <></>
                ) : (
                  <>
                    {/* //TODO: Main Row: Leader */}
                    <RowRegisterTopicTable
                      type={params.type}
                      key={dataItem.STT}
                      dataItem={dataItem}
                      isAlreadyRegisteredGroup={params.isAlreadyRegisteredGroup}
                      isEditTable={params.isEditTable}
                      isMultipleDelete={params.isMultipleDelete}
                      onChangeRow={(updatedDataItem: any) => {
                        //   setLocalDataTable((prevTable) =>
                        //     prevTable.map((item) =>
                        //       item.STT === updatedDataItem.STT
                        //         ? updatedDataItem
                        //         : item
                        //     )
                        //   );
                      }}
                      saveSingleRow={(updatedDataItem: any) => {
                        const updatedDataTable = dataTable.map((item, index) =>
                          item.STT === updatedDataItem.STT
                            ? updatedDataItem
                            : item
                        );

                        //   if (params.onSaveEditTable) {
                        //     params.onSaveEditTable(updatedDataTable);
                        //   }
                      }}
                      onClickGetOut={() => {
                        // params.onClickGetOut
                      }}
                      deleteSingleRow={() => {
                        //  params.onClickDelete
                      }}
                    />
                  </>
                )
              )}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* FOOTER */}
      {!isShowFooter || params.isEditTable || params.isMultipleDelete ? (
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

export default RegisterTopicTable;
