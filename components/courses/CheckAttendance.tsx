import { mockReportScheduleOptions } from "@/mocks";
import { useState } from "react";
import BorderContainer from "../shared/BorderContainer";
import IconButton from "../shared/Button/IconButton";
import CheckboxComponent from "../shared/CheckboxComponent";
import RadioboxComponent from "../shared/RadioboxComponent";

interface Props { }

const CheckAttendance = (params: Props) => {

  const [isCheck, setIsCheck] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const BoxComponent = mockReportScheduleOptions.setting.multipleSelect
    ? CheckboxComponent
    : RadioboxComponent;

  return (
    <>
      <p className="paragraph-semibold underline ">Điểm danh</p>
      <BorderContainer otherClasses="mt-4 p-6 flex flex-col gap-4">

        {isSubmit ? <p className="italic text-sm text-green-500">
          Câu trả lời của bạn đã được lưu!
        </p> : <BoxComponent
          id={1}
          handleClick={
            () => { setIsCheck(true) }
          }
          checked={
            isCheck
          }
          text={'Có mặt'}
        />}
      </BorderContainer>

      {isSubmit ? null : <IconButton
        text="Lưu câu trả lời"
        green
        otherClasses="mt-4"
        onClick={() => setIsSubmit(true)}
      />}

    </>
  );
};

export default CheckAttendance;
