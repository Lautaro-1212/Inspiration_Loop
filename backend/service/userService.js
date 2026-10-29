import { findAll, findById, findByEmail, create, update, deleteById } from "../repository/userRepository.js";

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

export function verifyUser(bodyData) {
    const { email, password } = bodyData;

    const user = getUserByEmail(email);

    if (!user) {
        return null;
    }

    if (user.password === password) {
        return user;
    }

    return null;
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