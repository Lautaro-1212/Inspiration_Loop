import { startBDD } from './database/schema.js';
import express from 'express'
import imageRouter from "./controller/imageController.js"

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
        startHTTP();
    } catch(error){
        console.log("Error: ", error)
    }
}

startServices();