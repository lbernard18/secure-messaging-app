import * as sqlite3 from "sqlite3";
import * as bcrypt from "bcrypt";
import { resolve } from "node:dns";

export const db = new sqlite3.Database("data/app.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            uid INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            is_admin BOOLEAN
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            mid INTEGER PRIMARY KEY AUTOINCREMENT,
            from_user INTEGER,
            to_user INTEGER,
            content TEXT,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
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
        db.run("INSERT INTO users (username, password, is_admin) VALUES (?,?,?)", 
            [username, hashedPassword, false],
            (err) => {
                if (err) resolve({success: false, error: "Database error"});
                else resolve({success: true, error: ""});
            }
        );
    });
}

function getUserByUsername(username:string): Promise<any> {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM users WHERE username = ?",
            [username],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        )
    })
}

export async function loginUser(username: string, password: string): Promise<{success: boolean, error: string, id: number}> {
    if (!username || !password) {
        return {success: false, error: "Missing fields", id: null};
    }

    const exists = await usernameExists(username);
    if (!exists) return {success: false, error: "Username doesn't exists", id: null};

    const user = await getUserByUsername(username);
    if (!user) return {success: false, error: "Couldn't find associated user", id: null};

    const match = await bcrypt.compare(password, user.password);
    if (!match) return {success: false, error: "Wrong password, try again", id: null};

    return {success: true, error: "", id: user.uid};
}

export async function storeMessage(from: number, to: number, content: string): Promise<{success: boolean, error: string}> {
    if (!from || !to || !content) {
        return {success: false, error: "Missing fields"};
    }


    return new Promise((resolve) => {
        db.run("INSERT INTO messages (from_user, to_user, content) VALUES (?,?,?)", 
            [from, to, content],
            (err) => {
                if (err) resolve({success: false, error: "Database error"});
                else resolve({success: true, error: ""});
            }
        );
    });
}

export async function getLogsForUser(userId: number): Promise<{success: boolean, error: string, messages: any[]}> {
    if (!userId) return {success: false, error: "Missing fields", messages: []};
    return new Promise((resolve) => {
        db.all(
            "SELECT * FROM messages WHERE uid = ?",
            [userId],
            (err, rows) => {
                if (err) resolve({success: false, error: "Database error", messages: []})
                else resolve({success: true, error: "", messages: rows})
            }
        );
    });
}

export async function isAdmin(userId: number): Promise<Boolean> {
    if (!userId) return false;
    return new Promise((resolve) => {
        db.get(
            "SELECT * FROM users WHERE uid = " + userId + " AND is_admin = true",
            (_, row) => resolve(row ? true : false)
        );
    });
}