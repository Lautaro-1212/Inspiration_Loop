import { arrancarBDD } from './database/schema.js';
import express from 'express'
import imageRouter from "./controller/imageController.js"

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/images", imageRouter)

function arracarHTTP(){
    app.listen(PORT, () => {
        console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
}

function arrancarServicios(){
    try{
        arrancarBDD()
        arracarHTTP()
    } catch(error){
        console.log("Error: ", error)
    }
}

arrancarServicios();