import "server-only";
import { isContentImageKey, readContentImage, storeContentImage } from "./content-images";

export const isProjectImageKey = isContentImageKey;
export const storeProjectImage = (file: File) => storeContentImage(file, "project-images");
export const readProjectImage = (key: string, admin = false) => readContentImage(key, "project-images", admin);
