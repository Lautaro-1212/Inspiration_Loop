import db from '../config/database.js'

export function startBDD(){
    db.exec(`
        CREATE TABLE IF NOT EXISTS image(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            width INTEGER,
            height INTEGER,
            description TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS category(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL  
        );

        CREATE TABLE IF NOT EXISTS image_category(
            id INTEGER PRIMARY KEY,
            image_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,

            FOREIGN KEY (image_id)
                REFERENCES image(id)
                ON DELETE CASCADE,

            FOREIGN KEY (category_id)
                REFERENCES category(id)
                ON DELETE CASCADE
        );
    `)

    console.log("The database was created successfully.");
}