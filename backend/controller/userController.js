import express from "express"
import { getAllUsers, getUserById, getUserByEmail, createNewUser, updateUser, deleteUserById } from "../service/userService.js"

const router = express.Router()

router.get("/", (req, res) => {
    let data = getAllUsers();
    res.send({ mensaje: data });
});

router.get("/email/:email", (req, res) => {
    let data = getUserByEmail(req.params.email)
    res.send({ mensaje: data })
})
    
router.get("/:id", (req,res) => {
    let data = getUserById(req.params.id);
    res.send({ mensaje: data });
});

router.post("/", (req, res) => {
    let data = createNewUser(req.body);
    res.send({ mensaje: data });
});

router.patch("/:id", (req, res) => {
    let data = updateUser(req.params.id, req.body)
    res.send({ mensaje: data})
})

router.delete("/:id", (req, res) => {
    let data = deleteUserById(req.params.id);
    res.send({ mensaje: data });
});

export default router;