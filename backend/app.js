import { startBDD } from './database/schema.js';
import express from 'express'
import imageRouter from "./controller/imageController.js"
import { ensureUploadDir } from "./config/fileStorage.js"

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/images", imageRouter)

function startHTTP(){
    app.listen(PORT, () => {
        console.log(`Server start in http://localhost:${PORT}`);
    });
}

function startServices(){
    try{
        startBDD();
        ensureUploadDir();
        startHTTP();
    } catch(error){
        console.log("Error: ", error)
    }
}

startServices();