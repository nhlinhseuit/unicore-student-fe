import { mockCategoryList } from "@/mocks";

const CategorySideBar = () => {
  return (
    <>
      {/* CALENDAR */}
      <div className="w-full card-wrapper rounded-[10px]">
        <div className=" flex w-full gap-4 p-4">
          {/* Category */}
          <div className="w-full ml-2 mr-2 sm:flex-row">
            <div className="flex flex-col gap-4">
              <p className="text-center base-semibold line-clamp-1">
                Lịch biểu
              </p>

              <div className="h-[100px]"> </div>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY */}
      <div className="mt-4 w-full card-wrapper rounded-[10px]">
        <div className=" flex w-full gap-4 p-4">
          {/* Category */}
          <div className="w-full ml-2 mr-2 sm:flex-row">
            <div className="flex flex-col gap-4">
              <p className="text-center base-semibold line-clamp-1">Danh mục</p>

              {mockCategoryList.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={(e) => {}}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <p className="body-regular -translate-y-[1px] text-dark200_light900 line-clamp-2 flex-1 m-0">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySideBar;
