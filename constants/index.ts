import { SidebarLink } from "@/types";
import { CourseType } from "@/types/entity/Course";

export const itemsPerPage = 30;
export const maxStudentPerGroup = 2;
export const minStudentPerGroup = 1;
export const itemsPerPageRegisterTable = 10;
export const itemsPerPageTopicTable = 20;
export const MAX_FILE_VALUE = 25; // 25MB
export const MAX_FILE_SIZE = MAX_FILE_VALUE * 1024 * 1024; // 25MB
export const ALLOWED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/pdf", // .pdf
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
  "text/plain", // .txt
  "image/jpeg",
  "image/png",
  "image/svg+xml",
];
export const MAX_CATEGORIES = 5; // Số danh mục tối đa chọn khi đăng thông báo

//
// TODO: Review
//
export const mockReviewOptions = [
  { id: 1, value: "Tất cả" },
  { id: 2, value: "Đã phúc khảo" },
  { id: 3, value: "Chưa phúc khảo" },
];

//
// TODO: Bookmark
//
export const mockBookmarkOptions = [
  { id: 1, value: "Tất cả" },
  { id: 2, value: "Thông báo" },
  { id: 3, value: "Bài tập" },
  { id: 4, value: "Bài tập lớn" },
];

// TODO: NAVBAR TAB
export const StudentAnnouncementsTabItems = [
  { value: "listAnnouncements", label: "Danh sách thông báo", route: "/" },
];

export const StudentCoursesTabItems = [
  { value: "listCourses", label: "Danh sách lớp học", route: "/courses" },
];

export const StudentSettingTabItems = [
  { value: "settingNoti", label: "Tin tức - thông báo", route: "/setting" },
];

export const DepartmentSubjectsTabItems = [
  { value: "listSubjects", label: "Danh sách môn học", route: "/subjects" },
  { value: "subjectTypes", label: "Loại môn học", route: "/subjects/types" },
];

export const StudentCourseTabItems = [
  { value: "generalPost", label: "Thông báo chung", route: "/" },
  {
    value: "happeningEvent",
    label: "Hoạt động đang diễn ra",
    route: "/happening-event",
  },
  {
    value: "exercises",
    label: "Bài tập",
    route: "/exercises",
  },
  {
    value: "manageGroup",
    label: "Đăng ký nhóm",
    route: "/manage-group",
  },
  {
    value: "events",
    label: "Sự kiện",
    route: "/events",
  },
  {
    value: "scoreTranscript",
    label: "Bảng điểm",
    route: "/score-transcript",
  },
  // {
  //   value: "timeTable",
  //   label: "Lịch biểu",
  //   route: "/time-table",
  // },
  {
    value: "files",
    label: "Lưu trữ",
    route: "/files",
  },
  {
    value: "reviews",
    label: "Phúc khảo",
    route: "/reviews",
  },
  {
    value: "setting",
    label: "Cài đặt",
    route: "/setting",
  },
];

export const StudentBookmarksTabItems = [
  {
    value: "general",
    label: "Chung",
    route: "/",
  },
  {
    value: "announcements",
    label: "Thông báo",
    route: "/announcements",
  },
  {
    value: "exercises",
    label: "Bài tập",
    route: "/exercises",
  },
  {
    value: "bigExercises",
    label: "Bài tập lớn",
    route: "/bigExercises",
  },
];

export const BigExerciseTabItems = [
  { value: "generalPost", label: "Thông báo chung", route: "/" },
  {
    value: "registerTopic",
    label: "Đăng ký đề tài",
    route: "/register-topic",
  },
  {
    value: "reviews",
    label: "Phúc khảo",
    route: "/reviews",
  },
  {
    value: "files",
    label: "Lưu trữ",
    route: "/files",
  },
];

// TODO: OTHERS

export enum Action {
  create,
  edit,
  editing,
  none,
}

export enum RegisterTopicTableType {
  registerTopic,
  approveTopic,
  // !: GỘP SAU:
  registerGroup,
}

export enum DataTableType {
  Course = "Lớp học",
  Subject = "Môn học",
  Student = "Sinh viên",
  Teacher = "Giảng viên",
}

export enum FilterType {
  SortNewer,
  SortOlder,
  DetailFilter,
  None,
}


export const ListCourseColors = [
  { type: CourseType.RegularCourseWithProject, color: "#e8f7ff" },
  { type: CourseType.InternCourse, color: "#fef5e5" },
  { type: CourseType.ProjectCourse, color: "#ecf2ff" },
  { type: CourseType.ThesisCourse, color: "#ecf2ff" },
];


export enum DetailFilter {
  Semester,
  Year,
  Subject,
  Teacher,
}

export const FilterTable = [
  { type: "sort" },
  {
    type: "detailFilter",
    data: [
      { type: "semester" },
      { type: "year" },
      { type: "subject" },
      { type: "teacher" },
    ],
  },
];

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const TableDataMoreComponentItems = [
  { value: "edit", label: "Chỉnh sửa" },
  { value: "delete", label: "Xóa" },
];

export const FileTableDataMoreComponentItems = [
  { value: "rename", label: "Đổi tên" },
  { value: "download", label: "Tải xuống" },
  { value: "delete", label: "Xóa" },
];

export const CourseItemMoreComponentItems = [
  { value: "edit", label: "Chỉnh sửa" },
  { value: "hide", label: "Ẩn" },
  { value: "archive", label: "Lưu trữ" },
];

// TODO: SIDEBAR

export const sidebarStudentLinks: SidebarLink[] = [
  {
    id: "1",
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Trang chủ",
  },
  {
    id: "2",
    imgURL: "/assets/icons/courses.svg",
    route: "/courses",
    label: "Lớp học",
  },
  {
    id: "3",
    imgURL: "/assets/icons/score-transcript.svg",
    route: "/score-transcript",
    label: "Bảng điểm",
  },
  // {
  //   id: "4",
  //   imgURL: "/assets/icons/timetable.svg",
  //   route: "/timetable",
  //   label: "Lịch biểu",
  // },
  // {
  //   id: "4",
  //   imgURL: "/assets/icons/messageIc.svg",
  //   route: "/messages",
  //   label: "Tin nhắn",
  // },
  {
    id: "4",
    imgURL: "/assets/icons/bookmarks.svg",
    route: "/bookmarks",
    label: "Dấu trang",
  },
  {
    id: "5",
    imgURL: "/assets/icons/setting.svg",
    route: "/setting",
    label: "Cài đặt",
  },
];
