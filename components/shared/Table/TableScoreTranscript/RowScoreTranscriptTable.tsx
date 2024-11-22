import { ScoreTranscriptData, ScoreTranscriptStudentData } from "@/types";
import { Table } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";

interface RowParams {
  dataItem: ScoreTranscriptStudentData;
  isEditTable?: boolean;
  isMultipleDelete?: boolean;
  isHasSubCourses?: boolean;
  onClickGetOut?: () => void;
  saveSingleRow?: (item: any) => void;
  deleteSingleRow?: (itemsSelected: string[]) => void;
  onClickCheckBoxSelect?: (item: string) => void;
  onChangeRow?: (item: any) => void;
  viewDetailGradeColumn: () => void;
}
interface handleInputChangeParams {
  key: ScoreTranscriptData;
  newValue: any;
  isMultipleInput?: boolean;
  currentIndex?: number;
  isCheckbox?: boolean;
}

const RowGradingGroupTable = React.memo(
  (params: RowParams) => {
    const [isEdit, setIsEdit] = useState(false);
    const [editDataItem, setEditDataItem] = useState(params.dataItem);

    const refInput = useRef({});

    useEffect(() => {
      if (params.isEditTable) setIsEdit(false);
    }, [[params.isEditTable]]);

    const handleEdit = () => {
      if (isEdit === false) {
        setIsEdit(true);
      } else {
        setIsEdit(false);
      }
    };

    var valueUniqueInput = params.dataItem["Mã lớp"];

    const renderTableCellValue = (
      keyId: string,
      key: string,
      value: any,
      isEdit: boolean
    ) => {
      return key === "Điểm quá trình" ||
        key === "Điểm thực hành" ||
        key === "Điểm giữa kỳ" ||
        key === "Điểm cuối kỳ" ? (
        <span
          className="cursor-pointer underline"
          onClick={params.viewDetailGradeColumn}
        >
          {value}
        </span>
      ) : (
        <span>{value}</span>
      );
    };

    return (
      <Table.Row
        key={params.dataItem.STT}
        onClick={() => {}}
        className={`bg-background-secondary  text-left ${
          isEdit || params.isEditTable
            ? "hover:bg-white cursor-default"
            : "hover:bg-light-800 cursor-default"
        } duration-100`}
      >
        {/* Các giá trị khác */}
        {Object.entries(params.dataItem).map(([key, value]) => {
          let keyId = params.dataItem["Mã lớp"];

          return (
            <Table.Cell
              key={`${keyId}_${key}_${value}`}
              theme={{
                base: `group-first/body:group-first/row:first:rounded-tl-lg
              group-first/body:group-first/row:last:rounded-tr-lg
              group-last/body:group-last/row:first:rounded-bl-lg
              group-last/body:group-last/row:last:rounded-br-lg
              px-4 py-4 text-center text-secondary-900`,
              }}
              className={`border-r-[1px] px-2 py-4 normal-case whitespace-nowrap text-left 
                ${
                  typeof value === "number" || key === "STT"
                    ? "text-center"
                    : ""
                }
                }
            `}
            >
              {renderTableCellValue(keyId, key, value, isEdit)}
            </Table.Cell>
          );
        })}
      </Table.Row>
    );
  },
  (prevProps, nextProps) => {
    // Kiểm tra nếu `dataItem` của RowGradingGroupTable không thay đổi thì không cần re-render
    return (
      prevProps.dataItem === nextProps.dataItem &&
      prevProps.isEditTable === nextProps.isEditTable &&
      prevProps.isMultipleDelete === nextProps.isMultipleDelete
    );
  }
);

export default RowGradingGroupTable;
