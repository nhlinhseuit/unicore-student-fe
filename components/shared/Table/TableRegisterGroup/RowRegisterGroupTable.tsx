import { StudentData, SubjectData, TeacherData } from "@/types";
import { CourseData } from "@/types/entity/Course";
import { RegisterGroupDataItem } from "@/types/entity/GroupRegister";
import { Table } from "flowbite-react";
import React from "react";

interface RowParams {
  dataItem: RegisterGroupDataItem;
}
interface handleInputChangeParams {
  key:
    | keyof CourseData
    | keyof SubjectData
    | keyof StudentData
    | keyof TeacherData;
  newValue: any;
  isMultipleInput?: boolean;
  currentIndex?: number;
  isCheckbox?: boolean;
}

const RowRegisterGroupTable = React.memo(
  (params: RowParams) => {
    return (
      <Table.Row
        key={params.dataItem.STT}
        onClick={() => {}}
        className={`bg-background-secondary  text-left hover:bg-light-800 cursor-default duration-100`}
      >
        {/* STT - Là STT của nhóm */}
        <Table.Cell className="w-10 border-r-[1px] text-center">
          <span>{params.dataItem.STT}</span>
        </Table.Cell>

        {/* Các giá trị khác */}
        {Object.entries(params.dataItem.data).map(([key, value]) => {
          let keyId = params.dataItem.data["Mã nhóm"];

          if (key === "Mã nhóm") return null;

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
              className={`border-r-[1px] px-2 py-4 normal-case whitespace-nowrap text-left ${
                key === "MSSV" || key === "SĐT" ? "text-center" : ""
              }`}
            >
              {key === "MSSV" || key === "Họ và tên" || key === "SĐT"
                ? Array.isArray(value)
                  ? value.map((item, index) => (
                      <React.Fragment key={index}>
                        {item}
                        {index < value.length - 1 && <br />}
                      </React.Fragment>
                    ))
                  : value
                : value}
            </Table.Cell>
          );
        })}
      </Table.Row>
    );
  },
  (prevProps, nextProps) => {
    // Kiểm tra nếu `dataItem` của RowRegisterGroupTable không thay đổi thì không cần re-render
    return prevProps.dataItem === nextProps.dataItem;
  }
);

export default RowRegisterGroupTable;
