import { mockReportScheduleOptions } from "@/mocks";
import { useState } from "react";
import BorderContainer from "../shared/BorderContainer";
import CheckboxComponent from "../shared/CheckboxComponent";
import RadioboxComponent from "../shared/RadioboxComponent";
import IconButton from "../shared/Button/IconButton";

interface Props {}

const RegisterReportSchedule = (params: Props) => {
  const [isEditing, setIsEditing] = useState(true);

  // có thể chọn nhiều option hoặc chỉ 1 nên phải handle
  const [selectedOption, setSelectedOption] = useState<number | number[]>(
    mockReportScheduleOptions.setting.multipleSelect ? [] : -1
  );

  const handleBoxClick = (id: number) => {
    if (mockReportScheduleOptions.setting.multipleSelect) {
      if (Array.isArray(selectedOption)) {
        if (selectedOption.includes(id)) {
          setSelectedOption(selectedOption.filter((item) => item !== id));
        } else {
          setSelectedOption([...selectedOption, id]);
        }
      }
    } else {
      setSelectedOption(id);
    }
  };

  console.log("selectedOption", selectedOption);

  const BoxComponent = mockReportScheduleOptions.setting.multipleSelect
    ? CheckboxComponent
    : RadioboxComponent;

  return (
    <>
      <p className="paragraph-semibold underline ">Đăng ký thứ tự báo cáo</p>
      <BorderContainer otherClasses="mt-4 p-6 flex flex-col gap-4">
        {mockReportScheduleOptions.data.map((item) => (
          <BoxComponent
            id={item.id}
            handleClick={
              isEditing
                ? () => {
                    handleBoxClick(item.id);
                  }
                : () => {}
            }
            checked={
              mockReportScheduleOptions.setting.multipleSelect
                ? Array.isArray(selectedOption) &&
                  selectedOption.includes(item.id)
                : selectedOption === item.id
            }
            text={item.value}
          />
        ))}
      </BorderContainer>

      <IconButton
        text={isEditing ? "Lưu câu trả lời" : "Sửa câu trả lời"}
        yellow={isEditing ? false : true}
        green={isEditing ? true : false}
        otherClasses="mt-4"
        onClick={() => setIsEditing(!isEditing)} // Chuyển đổi trạng thái chỉnh sửa
      />
    </>
  );
};

export default RegisterReportSchedule;
