import { mockCheckAttendaceAnswer, mockReportScheduleOptions } from "@/mocks";
import { useState } from "react";
import BorderContainer from "../shared/BorderContainer";
import IconButton from "../shared/Button/IconButton";
import CheckboxComponent from "../shared/CheckboxComponent";
import RadioboxComponent from "../shared/RadioboxComponent";

interface Props {}

const CheckAttendance = (params: Props) => {
  const [isCheck, setIsCheck] = useState(-1);
  const [isSubmit, setIsSubmit] = useState(false);

  const BoxComponent = mockReportScheduleOptions.setting.multipleSelect
    ? CheckboxComponent
    : RadioboxComponent;

  return (
    <>
      <p className="paragraph-semibold underline ">Điểm danh</p>
      <BorderContainer otherClasses="mt-4 p-6 flex flex-col gap-4">
        {isSubmit ? (
          <p className="italic text-sm text-green-500">
            Câu trả lời của bạn đã được lưu!
          </p>
        ) : (
          <div>
            <p className="text-base">{mockCheckAttendaceAnswer.question}</p>
            <div className="mt-6 flex flex-col gap-4">
              {mockCheckAttendaceAnswer.answer.map((item) => (
                <BoxComponent
                  key={item.id}
                  id={item.id}
                  handleClick={() => {
                    setIsCheck(item.id);
                  }}
                  checked={isCheck === item.id}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        )}
      </BorderContainer>

      {isSubmit ? null : (
        <IconButton
          text="Lưu câu trả lời"
          green
          otherClasses="mt-4"
          onClick={() => setIsSubmit(true)}
        />
      )}
    </>
  );
};

export default CheckAttendance;
