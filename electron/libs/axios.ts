import axios from "axios";
import Store from "electron-store";
import { StoreOptions } from "../options/options";

const API_URL =
  "https://17f6-2001-2d8-e1fb-4088-b802-a130-f422-3868.ngrok-free.app";

const store = new Store<StoreOptions>();

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${store.get("user")}`,
  },
});
