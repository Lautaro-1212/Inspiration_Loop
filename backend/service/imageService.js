import { findAll, findById, create, deleteById } from "../repository/imageRepository.js";

export function getImages(){
    return findAll();
}

export function getImagesXId(id) {
    return findById(id);
}

export function postImage(image){
    return create(image);
}

export function deleteImageXId(id){
    return deleteById(id);
}