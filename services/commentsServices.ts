import { IBackendRes } from "@/types/commonType";
import { sendRequest } from "@/utils/api";
import { revalidateTag } from "next/cache";

export const fetchComments = async (postId: string) => {
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/comments?source_id=67a71feff1c3785ee19110ac`,
    //   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/comments`,
      method: "GET",
      queryParams: { source_id: postId },
      nextOption: {
        next: { tags: ["list-comments"] },
      },
    });

    if (res?.data) {
      console.log("res comments:", res);
      return res.data;
    } else {
      throw new Error("Data format error: 'data' field is missing.");
    }

    // const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/comments?source_id=67a71feff1c3785ee19110ac`,
    //     {
    //       method: "GET",
    //     }
    //   );

    // if (res.ok) {
    //   console.log("res.json()", res.json());
    // }
  } catch (error) {
    console.error("fetchComments failed:", error);
    throw error;
  }
};

export const createPostComment = async (data: any) => {
  console.log("createComment");
  console.log("data", data);

  // const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/post/comments/create`,
    method: "POST",
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`,
    // },
    body: { ...data },
  });
  revalidateTag("create-post-comment");

  return res;
};
