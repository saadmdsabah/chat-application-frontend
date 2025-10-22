import { httpClient } from "../config/HttpClient";

interface CreateInvitationDto {
  roomId: string;
  sender: string;
  receiver: string;
}

export const sendInvitation = async (
  token: string,
  body: CreateInvitationDto
) => {
  const response = await httpClient.post(`/invitation/create`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

interface Invitation {
  id: string;
  roomId: string;
  sender: string;
  receiver: string;
  status: string;
  createdAt: Date;
}

interface SuccessResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
}

export const getAllSentInvitations = async (
  token: string,
  userName: string
): Promise<SuccessResponseDto<Invitation[]>> => {
  const response = await httpClient.get(`/invitation/sender/${userName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllReceivedInvitations = async (
  token: string,
  userName: string
): Promise<SuccessResponseDto<Invitation[]>> => {
  const response = await httpClient.get(`/invitation/receiver/${userName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

interface InvitationStatusDto {
  status: string;
  roomId: string;
  sender: string;
  receiver: string;
}

export const updateInvitationStatus = async (
  token: string,
  body: InvitationStatusDto
): Promise<boolean> => {
  const response = await httpClient.post(`/invitation/updateStatus`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export type { Invitation };
