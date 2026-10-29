import db from "../config/database.js";

export function findAll() {
    return db.prepare(`
        SELECT id, name, email
        FROM user
    `).all();
}

export function findById(id) {
    return db.prepare(`
        SELECT id, name, email
        FROM user
        WHERE id = ?
    `).get(id);
}

export function findByEmail(email) {
    return db.prepare(`
        SELECT id, name, email, password
        FROM user
        WHERE email = ?
    `).get(email);
}

export function create(user) {
    return db.prepare(`
        INSERT INTO user (name, email, password)
        VALUES (?, ?, ?)
    `).run(
        user.name,
        user.email,
        user.password
    );
}

export function update(id, user) {
    return db.prepare(`
        UPDATE user
        SET name = ?, email = ?, password = ?
        WHERE id = ?
    `).run(
        user.name,
        user.email,
        user.password,
        id
    );
}

export function deleteById(id) {
    return db.prepare(`
        DELETE FROM user
        WHERE id = ?
    `).run(id);
}
