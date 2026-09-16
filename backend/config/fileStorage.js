import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ensureUploadDir = () => {
    try{
        const uploadDir = path.join(__dirname, "..", "uploads", "images");
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("Path created:", uploadDir)

        return uploadDir;
    } catch(error){
        console.log("Error: " + error)
    }
};