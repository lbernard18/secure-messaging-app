import { Request, Response } from "express";
import { storeMessage, isAdmin, getLogsForUser } from "./db";

//const PRIVATE_KEY = 

export async function send(req: Request, res: Response) {
    if (!req.body || typeof req.body !== "object") {
        return res.send("Wrong parameters, failed to send message");
    }

    if (!req.session.user) {
        return res.send("Sorry, you are not logged in");
    }

    const { from, to, content } = req.body;

    const admin = await isAdmin(req.session.user.id);

    if (!admin) {
        if (from != req.session.user.id) {
            return res.send("Impossible to send a message from a different account than yours");
        }
    }

    // TODO : Check if message is good with c file

    const {success, error} = await storeMessage(from, to, content);
    if (!success) {
        const response = "Failed to send the message" + (error ? ", got error: " + error : "");
        return res.send(response);
    } else {
        return res.send("Message sent");
    }
}

export async function getLogs(req: Request, res: Response) {
    if (!req.body || typeof req.body !== "object") {
        return res.send("Wrong parameters, failed to send message");
    }

    if (!req.session.user) {
        return res.send("Sorry, you are not logged in");
    }

    const { uid } = req.body;

    const admin = await isAdmin(req.session.user.id);

    if (!admin) return res.send("Sorry, you do not have the permissions to look at the message logs");

    const {success, error, messages} = await getLogsForUser(uid);
    if (!success) {
        return res.send("Failed to get logs" + (error ? ", got error: " + error : ""));
    }
    return res.send(messages);
}