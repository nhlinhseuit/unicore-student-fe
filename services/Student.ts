export default interface Student {
  id: string;
  name: string;
  class: string;
}
export interface StudentDataItem {
  type: string;
  STT: string;
  isDeleted: boolean;
  data: StudentData;
}

export interface StudentData {
  MSSV: string;
  "Tài khoản": string;
  "Mật khẩu": string;
  "Họ và tên": string;
  "Lớp sinh hoạt": string;
  Email: string;
  SDT: string;
  "Giới tính": string;
  "Địa chỉ": string;
  "Ngày sinh": string;
}

export interface IStudentResponseData {
  id: string;
  name: string;
  code: string;
  email: string;
  phone?: string;
  address?: string;
  dob: string;
  gender: boolean;
  organization_id: string;
  advisory_class: string;
  academic_batch: string;
}
