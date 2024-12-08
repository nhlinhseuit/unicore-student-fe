import { tableTheme } from "@/components/shared/Table/components/DataTable";
import {
  GradeColumnPercentDataItem,
  ScoreTranscriptStudentDataItem,
} from "@/types";
import { Table } from "flowbite-react";

import RowScoreTranscriptTable from "./RowScoreTranscriptTable";

interface DataTableParams {
  dataTable: ScoreTranscriptStudentDataItem;
  dataGradeColumnPercent: GradeColumnPercentDataItem;
  viewDetailGradeColumn: () => void;
}

const ScoreTranscriptTable = (params: DataTableParams) => {
  return (
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
          {Object.keys(params.dataTable.listCoursesScore[0]).map(
            (key, index) => {
              return (
                <Table.HeadCell
                  key={`${key}_${index}`}
                  theme={tableTheme?.head?.cell}
                  className={`px-2 py-4 border-r-[1px] uppercase whitespace-nowrap`}
                >
                  {key}
                </Table.HeadCell>
              );
            }
          )}
        </Table.Head>

        {/* BODY */}
        <Table.Body className="text-left divide-y">
          {params.dataTable.listCoursesScore.map((dataItem, index) => (
            <RowScoreTranscriptTable
              key={dataItem.STT}
              dataItem={dataItem}
              onClickCheckBoxSelect={(item: string) => {
                //   setItemsSelected((prev) => {
                //   if (prev.includes(item)) {
                //     return prev.filter((i) => i !== item);
                //   } else {
                //     return [...prev, item];
                //   }
                // });
              }}
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
                // const updatedDataTable = dataTable.map((item, index) =>
                //   item.STT === updatedDataItem.STT ? updatedDataItem : item
                // );
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
              viewDetailGradeColumn={params.viewDetailGradeColumn}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ScoreTranscriptTable;
