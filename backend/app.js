import { startBDD } from './database/schema.js';
import express from 'express'
import cors from "cors";
import imageRouter from "./controller/imageController.js"
import path from 'path'
import { dirname } from './config/fileStorage.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(dirname, '..', 'uploads')));

app.use("/api/images", imageRouter)

function startHTTP(){
    app.listen(PORT, () => {
        console.log(`Server start in http://localhost:${PORT}`);
    });
}

function startServices(){
    try{
        startBDD();
        startHTTP();
    } catch(error){
        console.log("Error: ", error)
    }
}

startServices();