import multer from "multer";
import path from "node:path";
import { ensureUploadDir } from "./fileStorage.js"; // Importas tu helper

// Aseguramos que la carpeta exista y obtenemos la ruta
const uploadDir = ensureUploadDir();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;
        cb(null, nombreUnico);
    }
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (tiposPermitidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de archivo no permitido"), false);
        }
    }
});