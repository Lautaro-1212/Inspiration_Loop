import fs from "node:fs";
import { imageSize } from "image-size";
import { findAll, findById, randomImages, create, deleteById } from "../repository/imageRepository.js";

export function getImages(){
    return findAll();
}

export function getImagesXId(id) {
    return findById(id);
}

export function getRandomImages(){
    return randomImages();
}

export function postImage(bodyData, fileData) {
    const buffer = fs.readFileSync(fileData.path);
    const dimensions = imageSize(buffer);

    const imageData = {
        name: bodyData.name || fileData.originalname,
        path: fileData.path,
        width: dimensions.width,
        height: dimensions.height,
        description: bodyData.description
    };

    // Parsear las categorías enviadas desde req.body
    let categoryNames = [];

    if (bodyData.categories) {
        categoryNames = JSON.parse(bodyData.categories);
    }

    return create(imageData, categoryNames);
}

export function deleteImageXId(id){
    return deleteById(id);
}