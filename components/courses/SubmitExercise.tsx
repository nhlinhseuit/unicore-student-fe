import { useRef, useState } from "react";
import ClosedButton from "../shared/Annoucements/ClosedButton";
import RenderFile from "../shared/Annoucements/RenderFile";
import BorderContainer from "../shared/BorderContainer";
import IconButton from "../shared/Button/IconButton";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { MAX_FILE_SIZE, MAX_FILE_VALUE } from "@/constants";
import PickFileImageButton from "../shared/Annoucements/PickFileImageButton";
import { Input } from "../ui/input";

interface Props {
  score: number;
  totalScore: number;
  feedback: string;
  lateTime: string;
  lastEdited: string;
  submission: string;
  review?: string;
}

const SubmitExercise = (params: Props) => {
  const [isAlreadySubmit, setIsAlreadySubmit] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [isShowDialogConfirmReview, setIsShowDialogConfirmReview] =
    useState(false);

  const { toast } = useToast();

  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleFileButtonClick = () => {
    fileRef.current?.click();
  };

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            title: `Kích thước file vượt quá ${MAX_FILE_VALUE}MB.`,
            description: "Vui lòng chọn file nhỏ hơn.",
            variant: "error",
            duration: 3000,
          });
          return false;
        }
        return true;
      });

      setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  const linkSubmit = useRef<HTMLInputElement>(null);
  const updateStudentId = (value: string) => {
    if (linkSubmit.current) {
      linkSubmit.current.value = value;
    }
  };

  return (
    <>
      <p className="paragraph-semibold underline ">Bài nộp</p>
      <BorderContainer otherClasses="mt-4 p-6 flex flex-col gap-4">
        <div className="flex gap-10">
          <div className="flex flex-col gap-4">
            <p className="body-semibold text-black">Trạng thái bài nộp:</p>
            <p className="body-semibold text-black">Trạng thái chấm điểm:</p>
            <p className="body-semibold text-black">Góp ý:</p>
            <p className="body-semibold text-black">Thời gian còn lại:</p>
            <p className="body-semibold text-black">Chỉnh sửa lần cuối:</p>
            <p className="body-semibold text-black">Bài nộp:</p>
            {params.review ? (
              <p className="body-semibold text-black">Trạng thái phúc khảo:</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            <p className="body-medium text-green-500">Đã nộp để chấm điểm</p>

            <p className="body-medium text-green-500">
              {params.score}{" "}
              <span className="text-black">/ {params.totalScore} điểm</span>
            </p>

            <p className="body-medium">{params.feedback}</p>

            <p className="body-medium text-red-500">{params.lateTime}</p>

            <p className="body-medium">{params.lastEdited}</p>

            <p className="body-medium">{params.submission}</p>

            {params.review ? (
              <p className="body-medium">{params.review}</p>
            ) : null}
          </div>
        </div>
      </BorderContainer>

      {isEditting ? (
        <>
          <BorderContainer otherClasses="mt-4 p-6 flex flex-col gap-4">
            <div className="flex items-center">
              <span className="mr-4 text-dark400_light800 text-[14px] font-semibold leading-[20.8px] whitespace-nowrap">
                File đính kèm
              </span>
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".docx, .pdf, .pptx, .xlsx, .xls, .txt, image/*"
                  multiple
                  onChange={handleChooseFile}
                  style={{ display: "none" }}
                />

                <PickFileImageButton
                  handleButtonClick={handleFileButtonClick}
                  icon={"/assets/icons/attach_file.svg"}
                  alt={"file"}
                  text="Chọn file"
                />
              </>
              <span className="ml-6 mr-6 text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                /
              </span>
              <span className="mr-4 text-dark400_light800 text-[14px] font-semibold leading-[20.8px]">
                Điền link drive
              </span>
              <div>
                <Input
                  ref={linkSubmit}
                  name="linkSubmit"
                  placeholder={"Điền link..."}
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[46px] border"
                />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <ClosedButton
                  key={`${index}_${file.name}`}
                  _id={index}
                  onClose={(fileIndex) => {
                    setSelectedFiles((prevFiles) =>
                      prevFiles.filter((_, index) => index !== fileIndex)
                    );
                  }}
                >
                  <RenderFile _id={index} name={file.name} />
                </ClosedButton>
              ))}
            </div>
          </BorderContainer>

          <div className="flex items-center gap-2">
            <IconButton
              text={"Lưu"}
              otherClasses="mt-4"
              onClick={() => {
                setIsEditting(false);
                setIsAlreadySubmit(true);
              }}
            />
            <IconButton
              text={"Hủy"}
              gray
              otherClasses="mt-4"
              onClick={() => {
                setIsEditting(false);
              }}
            />
          </div>
        </>
      ) : (
        <div className="mt-4 flex gap-2">
          <IconButton
            text={isAlreadySubmit ? "Sửa bài tập" : "Nộp bài tập"}
            yellow={isAlreadySubmit ? true : false}
            green={isAlreadySubmit ? false : true}
            onClick={() => {
              setIsEditting(true);
            }}
          />
          {isAlreadySubmit ? (
            <>
              <IconButton
                text={"Nhắn tin liên hệ giảng viên"}
                onClick={() => {}}
              />
              <IconButton
                text={"Phúc khảo điểm"}
                red
                onClick={() => {
                  setIsShowDialogConfirmReview(true);
                }}
              />
            </>
          ) : null}
        </div>
      )}

      {isShowDialogConfirmReview ? (
        <AlertDialog open={isShowDialogConfirmReview}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận đăng ký phúc khảo?</AlertDialogTitle>
              <AlertDialogDescription>
                Bài làm sẽ được gửi đến giảng viên để yêu cầu phúc khảo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setIsShowDialogConfirmReview(false);
                  // params.onClickGetOut && params.onClickGetOut();
                }}
              >
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setIsShowDialogConfirmReview(false);
                  // params.onClickDelete && params.onClickDelete();
                }}
                className="bg-primary-500 hover:bg-primary-500/90"
              >
                Đồng ý
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <></>
      )}
    </>
  );
};

export default SubmitExercise;
