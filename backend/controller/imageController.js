import express from "express"
import { getImages ,getImagesXId, postImage, deleteImageXId } from "../service/imageService.js";

const router = express.Router();

router.get("/", (req, res) => {
    let data = getImages();
    res.send({ mensaje: data });
});

router.get("/:id", (req,res) => {
    let data = getImagesXId(req.params.id);
    res.send({ mensaje: data });
});

router.post("/", (req, res) => {
    console.log("BODY:", req.body);
    let data = postImage(req.body)
    res.send({ mensaje: data });
});

router.delete("/:id", (req, res) => {
    let data = deleteImageXId(req.params.id);
    res.send({ mensaje: data });
});

export default router;