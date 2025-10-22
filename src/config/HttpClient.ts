import axios from "axios";

export const baseUrl = "http://localhost:8080/api/v1";

export const httpClient = axios.create({ baseURL: baseUrl });
