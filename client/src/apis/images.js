import apiRequest from ".";

export const UploadImage = async (payload) => {
  return await apiRequest({
    method: "POST",
    endPoint: "/api/images/upload-image",
    payload,
  });
};
