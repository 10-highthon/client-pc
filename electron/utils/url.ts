import { RENDERER_DIST, VITE_DEV_SERVER_URL } from "../main";
import path from "node:path";

export const getURL = (_path?: string) => {
  return VITE_DEV_SERVER_URL ?? path.join(RENDERER_DIST, "index.html#") + _path;
};
