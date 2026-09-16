import fs from "node:fs";
import { imageSize } from "image-size";
import { findAll, findById, create, deleteById } from "../repository/imageRepository.js";

export function getImages(){
    return findAll();
}

export function getImagesXId(id) {
    return findById(id);
}

export function postImage(bodyData, fileData) {
    // 2. Leemos el archivo físico para obtener un Buffer
    const buffer = fs.readFileSync(fileData.path);

    // 3. Pasamos el buffer a imageSize
    const dimensions = imageSize(buffer);

    const imageData = {
        name: bodyData.name || fileData.originalname,
        path: fileData.path,
        width: dimensions.width,
        height: dimensions.height
    };

    return create(imageData);
}

export function deleteImageXId(id){
    return deleteById(id);
}