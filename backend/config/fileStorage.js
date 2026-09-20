import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

export const ensureUploadDir = () => {
    try{
        const uploadDir = path.join(dirname, "..", "uploads", "images");
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("Path created:", uploadDir)

        return uploadDir;
    } catch(error){
        console.log("Error: " + error)
    }
};