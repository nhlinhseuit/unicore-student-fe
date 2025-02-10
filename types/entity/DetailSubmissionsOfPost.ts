import { IFileSubmissionResponseData } from "./FileSubmission";

export interface IDetailSubmissionsOfPostResponseData {
  id: string;
  submitters: IFileSubmissionResponseData[];
  group: true;
  grade: 0;
  feedback: string;
  files: IFileSubmissionResponseData[];
  created_date: string;
  modified_date: string;
  created_by: string;
  modified_by: string;
  event_id: string;
  attachment_id: string;
  attachment_name: string;
  attachment_url: string;
  member_grades: {
    additionalProp1: 0;
    additionalProp2: 0;
    additionalProp3: 0;
  }; //? ??
  submit_time_status: string;
}
