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

export function randomImages(){
    const resultado = db.prepare(`
        SELECT *
        FROM image
        ORDER BY RANDOM()
    `).all();

    return resultado;
}

export function create(image, categoryNames = []) {
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

        // 2. Preparar consultas para categorías
        const findCategory = db.prepare(`
            SELECT id
            FROM category
            WHERE name = ?
        `);

        const createCategory = db.prepare(`
            INSERT INTO category (name)
            VALUES (?)
        `);

        const insertCategory = db.prepare(`
            INSERT INTO image_category (image_id, category_id)
            VALUES (?, ?)
        `);

        // 3. Procesar categorías
        for (const categoryName of categories) {

            const name = categoryName.trim();

            if (!name) {
                continue;
            }

            let category = findCategory.get(name);

            // Si no existe, la creamos
            if (!category) {
                const resultCategory = createCategory.run(name);

                category = {
                    id: resultCategory.lastInsertRowid
                };
            }

            // 4. Crear relación imagen ↔ categoría
            insertCategory.run(imageId, category.id);
        }

        return {
            imageId,
            changes: result.changes
        };
    });

    return createTransaction(image, categoryNames);
}

export function deleteById(id){
    const resultado = db.prepare(`
        DELETE FROM image
        WHERE id = ?
    `).run(id);

    console.log("Se elimino la imagen de id " + id);

    return resultado;
}