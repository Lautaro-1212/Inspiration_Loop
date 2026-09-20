import express from "express"
import { getImages ,getImagesXId, getRandomImages ,postImage, deleteImageXId } from "../service/imageService.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/", (req, res) => {
    let data = getImages();
    res.send({ mensaje: data });
});

router.get("/random", (req, res) => {
    let data = getRandomImages();
    res.send({ mensaje: data });
});
    
router.get("/:id", (req,res) => {
    let data = getImagesXId(req.params.id);
    res.send({ mensaje: data });
});

router.post("/", upload.single("image"), (req, res) => {
    // 1. Validamos que el cliente haya subido un archivo
    if (!req.file) {
        return res.status(400).send({ error: "No se proporcionó una imagen o el formato no es válido" });
    }

    // 2. Le pasamos al servicio tanto el body como el archivo
    let data = postImage(req.body, req.file);
    res.send({ mensaje: data });
});

router.delete("/:id", (req, res) => {
    let data = deleteImageXId(req.params.id);
    res.send({ mensaje: data });
});

export default router;