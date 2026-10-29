import { findAll, findById, findByEmail, create, update, deleteById } from "../repository/userRepository";

export function getAllUsers(){
    return findAll();
}

export function getUserById(id){
    return findById(id)
}

export function getUserByEmail(email){
    return findByEmail(email);
}

export function createNewUser(bodyData){
    const userData = {
        name: bodyData.name,
        email: bodyData.email,
        password: bodyData.password
    }

    return create(userData)
}

export function updateUser(id, bodyData) {
    const userData = {
        name: bodyData.name,
        email: bodyData.email,
        password: bodyData.password
    };

    return update(id, userData);
}

export function deleteUserById(id){
    return deleteById(id)
}