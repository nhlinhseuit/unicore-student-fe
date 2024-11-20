import React, { useState } from "react";
import IconButton from "../shared/Button/IconButton";
import RadioboxComponent from "../shared/RadioboxComponent";
import BorderContainer from "../shared/BorderContainer";

interface Props {}

const RegisterReportSchedule = (params: Props) => {
  var isUseExistedGroup = 0;

  const mockReportScheduleOptions = {
    setting: {
      multipleSelect: false,
      updateOption: true,
    },
    data: [
      {
        id: 1,
        value: "Ngày 3/10, 8h - 8h30",
      },
      {
        id: 2,
        value: "Ngày 3/10, 8h30 - 9h",
      },
      {
        id: 3,
        value: "Ngày 3/10, 9h30 - 10h",
      },
      {
        id: 4,
        value: "Ngày 3/10, 10h30 - 10h30",
      },
    ],
  };

  const [selectedOption, setSelectedOption] = useState(
    mockReportScheduleOptions.setting.multipleSelect ? -1 : []
  );

  return (
    <>
      <p className="paragraph-semibold underline ">Đăng ký thứ tự báo cáo</p>
      <BorderContainer otherClasses="mt-4 p-6 flex flex-col gap-4">
        {mockReportScheduleOptions.data.map((item) => (
          <RadioboxComponent
            id={item.id}
            handleClick={() => {
              // setIsUseExistedGroup(1);
            }}
            value={isUseExistedGroup}
            text={item.value}
          />
        ))}
      </BorderContainer>
    </>
  );
};

export default RegisterReportSchedule;
