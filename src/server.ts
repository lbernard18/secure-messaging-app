import session from "express-session";
import { createAccount, login } from "./auth";
import { getLogs, send } from "./message";
import dotenv from "dotenv";

dotenv.config();

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(session({
    name: "sid",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));

app.get('/', (req: any, res: any) => {
    res.send("OK");
});

app.listen(port, () => {
    console.log("Server running on http://localhost:3000");
});

app.post('/create-account', createAccount);

app.post('/login', login);

app.post('/logs', getLogs);

app.post('/send', send);