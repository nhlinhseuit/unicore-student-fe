"use client";

import IconButton from "@/components/shared/Button/IconButton";
import SubmitButton from "@/components/shared/Button/SubmitButton";
import RegisterTopicTable from "@/components/shared/Table/TableRegisterTopic/RegisterTopicTable";
import { RegisterTopicTableType } from "@/constants";
import { mockDataStudentRegisterTopic } from "@/mocks";

const RegisterTopic = () => {
  return (
    <>
      <RegisterTopicTable
        type={RegisterTopicTableType.registerTopic}
        isEditTable={false}
        isMultipleDelete={false}
        dataTable={mockDataStudentRegisterTopic}
      />

      <div className="flex mt-12 gap-2">
        <SubmitButton text="Đăng" otherClasses="w-fit" onClick={() => {}} />
        <IconButton text="Tạm lưu" temp otherClasses="w-fit" />
        <IconButton text="Hủy" red otherClasses="w-fit" onClick={() => {}} />
      </div>
    </>
  );
};

export default RegisterTopic;
