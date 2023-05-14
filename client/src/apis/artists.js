import apiRequest from ".";

export const AddArtist = async (payload) => {
  return await apiRequest({
    method: "POST",
    endPoint: "/api/artists",
    payload,
  });
};

export const GetAllArtists = async () => {
  return await apiRequest({
    method: "GET",
    endPoint: "/api/artists",
  });
};

export const GetArtistById = async (id) => {
  return await apiRequest({
    method: "GET",
    endPoint: `/api/artists/${id}`,
  });
};

export const UpdateArtist = async (id, payload) => {
  return await apiRequest({
    method: "PUT",
    endPoint: `/api/artists/${id}`,
    payload,
  });
};

export const DeleteArtist = async (id) => {
  return await apiRequest({
    method: "DELETE",
    endPoint: `/api/artists/${id}`,
  });
};
