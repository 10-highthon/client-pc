import axios from "axios";
import Store from "electron-store";
import { StoreOptions } from "../options/options";

const API_URL = "http://192.168.0.234:3000";

const store = new Store<StoreOptions>();

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${store.get("user")}`,
  },
});
