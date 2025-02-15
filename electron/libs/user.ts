import { axiosInstance } from "./axios";

interface UserResponse {
  id: string;
}

export const createUser = async () => {
  const { data } = await axiosInstance.post<UserResponse>("/user/new");
  return data;
};
