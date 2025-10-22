import { httpClient } from "../config/HttpClient";

export const getUserRooms = async (token: string, userName: string) => {
  const response = await httpClient.get(`/${userName}/joinedRooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
