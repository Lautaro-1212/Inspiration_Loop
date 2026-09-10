import { arrancarBDD } from './database/schema.js';
import express from 'express'

const app = express();
const PORT = 3000;

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