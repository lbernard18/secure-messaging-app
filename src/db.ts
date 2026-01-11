import * as sqlite3 from "sqlite3";

export const db = new sqlite3.Database("data/app.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            uid INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
});

export function usernameExists(username: string): Promise<boolean> {
    if (!username) return new Promise(() => false);

    return new Promise((resolve) => {
        db.get(
            "SELECT 1 FROM users WHERE username = ?", 
            [username],
            (_, row) => resolve(row ? true : false)
        );
    });
}

export async function createUser(username: string, hashedPassword: string): Promise<{success: boolean, error: string}> {
    if (!username || !hashedPassword) {
        return { success: false, error: "Missing fields"};
    }

    const exists = await usernameExists(username);
    if (exists) return {success: false, error: "Username already exists"};

    return new Promise((resolve) => {
        db.run("INSERT INTO users (username, password) VALUES (?,?)", 
            [username, hashedPassword],
            (err) => {
                if (err) resolve({success: false, error: "Database error"});
                else resolve({success: true, error: ""});
            }
        );
    });
}