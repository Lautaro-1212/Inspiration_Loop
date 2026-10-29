import db from "../config/database.js";

// Consulta común: imagen + categorías
const imageWithCategories = `
    SELECT
        image.*,
        user.name AS user_name,
        (
            SELECT json_group_array(category.name)
            FROM image_category
            JOIN category
                ON category.id = image_category.category_id
            WHERE image_category.image_id = image.id
        ) AS categories
    FROM image
    JOIN user
        ON user.id = image.user_id
`;

// Convierte las categorías de JSON string a array de JavaScript
function parseCategories(image) {
    if (!image) return image;

    return {
        ...image,
        categories: JSON.parse(image.categories ?? "[]")
    };
}

export function findAll() {
    const resultado = db.prepare(imageWithCategories).all();

    console.log("Se obtuvieron todas las imágenes");

    return resultado.map(parseCategories);
}

export function findById(id) {
    const resultado = db.prepare(`
        ${imageWithCategories}
        WHERE image.id = ?
    `).get(id);

    console.log("La imagen con id " + id);

    return parseCategories(resultado);
}

export function randomImages() {
    const resultado = db.prepare(`
        ${imageWithCategories}
        ORDER BY RANDOM()
    `).all();

    console.log("Resultado SQL:", resultado);

    const imagenes = resultado.map(parseCategories);

    console.log("Resultado final:", imagenes);

    return imagenes;
}

export function create(image, categoryNames = []) {
    const createTransaction = db.transaction((imageData, categories) => {

        // 1. Insertar la imagen
        const result = db.prepare(`
            INSERT INTO image (
                user_id, name, path, width, height, description
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            imageData.user_id,
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