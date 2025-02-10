import { IBackendRes } from "@/types/commonType";
import { sendRequest } from "@/utils/api";
import { revalidateTag } from "next/cache";

export const submitFile = async (data: any) => {
  console.log("submitFile");
  console.log("data", data);

  // const res = await sendRequest<IBackendRes<any>>({
  //   // url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/classevent/submissions`,
  //   //! fix tạm CORS
  //   url: "/api/v1/classevent/submissions",
  //   method: "POST",
  //   body: { ...data },
  // });
  // // revalidateTag("submit-file");

  // return res;

  const response = await fetch(
    //   // url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/classevent/submissions`,
    //! test tạm CORS
    "/api/v1/classevent/submissions",
    {
      method: "POST",
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
      body: data,
    }
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const dataRes = await response.json();
  return dataRes; // Trả về dữ liệu từ API
};

export const getSubmissionsOfPost = async (eventId: string) => {
  console.log("getSubmissionsOfPost");
  console.log("eventId", eventId);

  try {
    const response = await fetch(
      //! test tạm CORS
      `/api/v1/classevent/submissions/event/${eventId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("getSubmissionsOfPost failed:", error);
    throw error;
  }
};

export const getDetailSubmissionsOfPost = async (eventId: string) => {
  console.log("getDetailSubmissionsOfPost");
  console.log("eventId", eventId);

  try {
    const response = await fetch(
      //! test tạm CORS
      `/api/v1/classevent/submissions/${eventId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("getDetailSubmissionsOfPost failed:", error);
    throw error;
  }
};


//TODO: AUTH

export const checkAuthGoogle = async (studentMail: string) => {
  console.log("submitFile");
  console.log("studentMail", studentMail);

  try {
    // const res = await sendRequest<IBackendRes<any>>({
    //   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/file/check-auth/${studentMail}`,
    //   method: "GET",
    //   nextOption: {
    //     next: { tags: ["check-auth"] },
    //   },
    // });

    // if (res?.data) {
    //   return res.data;
    // } else {
    //   throw new Error("Auth google failed.");
    // }

    const response = await fetch(
      // `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/file/check-auth/${studentMail}`,

      //! test tạm CORS
      `/api/v1/file/check-auth/${studentMail}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("checkAuthGoogle failed:", error);
    throw error;
  }
};
