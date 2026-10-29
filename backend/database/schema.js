import db from '../config/database.js';

export function startBDD() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS image (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            width INTEGER,
            height INTEGER,
            description TEXT NOT NULL,

            FOREIGN KEY (user_id)
                REFERENCES user(id)
        );

        CREATE TABLE IF NOT EXISTS category (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS image_category (
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
    `);

    console.log("The database was created successfully.");
}