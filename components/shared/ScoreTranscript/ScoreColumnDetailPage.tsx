import { mockPostDataGradingDetail } from "@/mocks";
import { PostDataGradingDetailItem } from "@/types";
import { useRef, useState } from "react";
import BackToPrev from "../BackToPrev";
import PostScoreColumnDetailItem from "./PostScoreColumnDetailItem";

interface Props {
  onClickPrev: () => void;
}

const ScoreColumnDetailPage = (params: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const refData = useRef(mockPostDataGradingDetail);

  return (
    <>
      <BackToPrev text="Quay lại Bảng điểm" onClickPrev={params.onClickPrev} />

      <div className="flex justify-between mb-6">
        <div className="ml-4 flex gap-4 items-center">
          <p className="paragraph-semibold">
            Chi tiết cột điểm Quá trình
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {mockPostDataGradingDetail.map((item, index) => (
          <PostScoreColumnDetailItem
            key={item.id}
            // id={item.id}
            // creator={item.creator}
            // createdAt={item.createdAt}
            // title={item.title}
            // fileName={item.fileName}
            // scoreDetail={item.scoreDetail}
            postScoreDetail={item}
            setGrading={() => {
              // setIsGrading(true);
            }}
            isEdit={isEdit}
            savePostScoreDetail={(
              newPostScoreDetailItem: PostDataGradingDetailItem
            ) => {
              refData.current = mockPostDataGradingDetail.map((item) => {
                if (item.id === newPostScoreDetailItem.id)
                  return newPostScoreDetailItem;
                else return item;
              });
            }}
          />
        ))}
      </div>
    </>
  );
};

export default ScoreColumnDetailPage;
