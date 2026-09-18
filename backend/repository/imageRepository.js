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

export function create(image, categoryIds = []) {
    const createTransaction = db.transaction((imageData, categories) => {
        // 1. Insertar la imagen
        const result = db.prepare(`
            INSERT INTO image (name, path, width, height, description)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            imageData.name,
            imageData.path,
            imageData.width,
            imageData.height,
            imageData.description
        );

        const imageId = result.lastInsertRowid;

        // 2. Insertar solo categorías válidas
        if (categories && categories.length > 0) {
            const checkCategory = db.prepare(`SELECT id FROM category WHERE id = ?`);
            const insertCategory = db.prepare(`
                INSERT INTO image_category (image_id, category_id)
                VALUES (?, ?)
            `);

            for (const categoryId of categories) {
                // Verificamos si existe antes de insertar en image_category
                const categoryExists = checkCategory.get(categoryId);
                if (categoryExists) {
                    insertCategory.run(imageId, categoryId);
                }
            }
        }

        return { imageId, changes: result.changes };
    });

    return createTransaction(image, categoryIds);
}

export function deleteById(id){
    const resultado = db.prepare(`
        DELETE FROM image
        WHERE id = ?
    `).run(id);

    console.log("Se elimino la imagen de id " + id);

    return resultado;
}