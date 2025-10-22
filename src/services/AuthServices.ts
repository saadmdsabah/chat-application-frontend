import { httpClient } from "../config/HttpClient";

interface UserCredentials {
  userName: string;
  password: string;
}

interface User {
  userName: string;
  userPassword: string;
  aboutUser: string;
}

export const loginUser = async (userCredentials: UserCredentials) => {
  const reponse = await httpClient.post("/auth/login", userCredentials);
  return reponse.data;
};

export const registerUser = async (user: User) => {
  const reponse = await httpClient.post("/auth/register", user);
  return reponse.data;
};

export const verifyToken = async (token: string) => {
  const reponse = await httpClient.post("/token/verify", token);
  return reponse.data;
};
