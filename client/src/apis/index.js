import axios from "axios";

const apiRequest = async ({ method, endPoint, payload, queryStrings }) => {
  try {
    const response = await axios({
      method,
      url: endPoint,
      data: payload,
      params: queryStrings,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || error.message || "Something went wrong"
    );
  }
};

export default apiRequest;
