import express from "express"
import { getAllUsers, getUserById, getUserByEmail, createNewUser, updateUser, deleteUserById, verifyUser } from "../service/userService.js"

const router = express.Router()

router.get("/", (req, res) => {
    let data = getAllUsers();
    res.send({ data });
});

router.get("/email/:email", (req, res) => {
    let data = getUserByEmail(req.params.email)
    res.send({ data })
})
    
router.get("/:id", (req,res) => {
    let data = getUserById(req.params.id);
    res.send({ data });
});

router.post("/register", (req, res) => {
    const data = createNewUser(req.body);

    return res.status(201).json({ user: data });
});

router.post("/login", (req, res) => {
    const data = verifyUser(req.body ?? {});

    if (!data) {
        return res.status(401).json({
            error: "Email o contraseña incorrectos"
        });
    }

    return res.status(200).json({
        mensaje: "Inicio de sesión exitoso",
        user: {
            id: data.id,
            name: data.name,
            email: data.email
        }
    });
});

router.patch("/:id", (req, res) => {
    let data = updateUser(req.params.id, req.body)
    res.send({ data })
}) 

router.delete("/:id", (req, res) => {
    let data = deleteUserById(req.params.id);
    res.send({ data });
});

export default router;