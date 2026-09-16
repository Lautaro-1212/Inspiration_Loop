import db from "../config/database.js";

export function findAll(){
    const resultado =  db.prepare(`
        SELECT *
        FROM image
    `).all();

    console.log("Se obtuvieron todas las imagenes")

    return resultado;
}   

export function findById(id){
    const resultado = db.prepare(`
        SELECT *
        FROM image
        WHERE id = ?
    `).get(id);

    console.log("La imagen con id " + id)

    return resultado;
}

export function create(image){
    const resultado = db.prepare(`
        INSERT INTO image (name, path, width, height)
        VALUES (?, ?, ?, ?)
    `).run(
        image.name,
        image.path,
        image.width,
        image.height
    );

    console.log("La imagen se creo correctamente")

    return resultado;
}

export function deleteById(id){
    const resultado = db.prepare(`
        DELETE FROM image
        WHERE id = ?
    `).run(id);

    console.log("Se elimino la imagen de id " + id);

    return resultado;
}