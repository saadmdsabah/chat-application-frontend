import { httpClient } from "../config/HttpClient";

interface Room {
  userName: string;
  privateRoom: boolean;
}

export const CreateRoomService = async (
  roomId: string,
  token: string,
  room: Room
) => {
  const response = await httpClient.post(`/rooms/${roomId}`, room, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const JoinRoomService = async (
  roomId: string,
  token: string,
  userName: string
) => {
  const response = await httpClient.get(
    `/rooms/${roomId}?userName=${encodeURIComponent(userName)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
    }
  );
  return response.data;
};

export const LoadRoomMessages = async (
  roomId: string,
  size: number,
  page: number,
  token: string,
  userName: string
) => {
  const response = await httpClient.get(
    `/rooms/${roomId}/messages?size=${size}&page=${page}&userName=${encodeURIComponent(
      userName
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const checkIfPrivateRoom = async (
  roomId: string,
  token: string,
  userName: string
) => {
  const response = await httpClient.get(
    `/rooms/entryPossible/${roomId}?userName=${encodeURIComponent(userName)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const privateRoomCreater = async (roomId: string, token: string) => {
  const response = await httpClient.get(`/rooms/${roomId}/creater`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
