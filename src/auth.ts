import { Request, Response } from "express";
import { db, usernameExists, createUser, loginUser } from "./db";
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function createAccount(req: Request, res: Response) {
    if (!req.body || typeof req.body !== "object") {
        return res.send("Wrong parameters, account creation failed");
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("Wrong parameters, account creation failed");
    }

    const exists = await usernameExists(username);
    if (exists) return res.send("Sorry, username already exists");

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const {success, error} = await createUser(username, hashedPassword);
    if (!success) return res.send(error);

    return res.send(`Account created with username ${username}`);
}

export async function login(req: Request, res: Response) {
    if (!req.body || typeof req.body !== "object") {
        return res.send("Wrong parameters, account creation failed")
    }

    if (req.session.user) {
        return res.send("User already logged in with user id " + req.session.user.id);
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("Wrong parameters, account creation failed");
    }

    const {success, error, id} = await loginUser(username, password);
    if (!success) {
        return res.send(error ? error : "Failed to login");
    } else {
        req.session.user = { id };
        return res.send("Login succesful, your user id is : " + id);
    }
}