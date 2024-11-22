import { GradeColumnPercentDataItem, ScoreTranscriptDataCourse } from "@/types";
import { Table } from "flowbite-react";
import { useState } from "react";
import { tableTheme } from "../components/DataTable";

interface DataTableParams {
  isEditTable: boolean;
  isMultipleDelete: boolean;
  dataTable: ScoreTranscriptDataCourse;
  dataGradeColumnPercent: GradeColumnPercentDataItem;
  viewDetailGradeColumn: () => void;
}

const ScoreTranscriptTableCourse = (params: DataTableParams) => {
  const [isShowDialog, setIsShowDialog] = useState(-1);

  return (
    <div>
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
            {Object.keys(params.dataTable).map((key, index) => {
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
            <Table.Row
              onClick={() => {}}
              className={`bg-background-secondary  text-left hover:bg-light-800 cursor-defaultduration-100`}
            >
              {Object.entries(params.dataTable).map(([key, value], index) => (
                <Table.Cell
                  key={`$${key}_${value}`}
                  theme={{
                    base: `group-first/body:group-first/row:first:rounded-tl-lg
                      group-first/body:group-first/row:last:rounded-tr-lg
                      group-last/body:group-last/row:first:rounded-bl-lg
                      group-last/body:group-last/row:last:rounded-br-lg
                      px-4 py-4 text-center text-secondary-900`,
                  }}
                  className={`border-r-[1px] px-2 py-4 normal-case whitespace-nowrap text-center underline`}
                >
                  <span
                    className="cursor-pointer underline"
                    onClick={params.viewDetailGradeColumn}
                  >
                    {value}
                  </span>
                </Table.Cell>
              ))}
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ScoreTranscriptTableCourse;
