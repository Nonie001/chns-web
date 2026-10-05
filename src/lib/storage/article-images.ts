import "server-only";
import { isContentImageKey, readContentImage, storeContentImage } from "./content-images";

export const isArticleImageKey = isContentImageKey;
export const storeArticleImage = (file: File) => storeContentImage(file, "article-images");
export const readArticleImage = (key: string, admin = false) => readContentImage(key, "article-images", admin);
