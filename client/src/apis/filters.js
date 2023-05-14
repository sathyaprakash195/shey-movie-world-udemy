import apiRequest from ".";

export const GetQuickSearchFilterResults = async (payload) => {
  return await apiRequest({
    method: "GET",
    endPoint: "/api/filters",
    queryStrings: payload,
  });
};
