import { createAccount } from "./auth";

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: any, res: any) => {
    res.send("OK");
});

app.listen(port, () => {
    console.log("Server running on http://localhost:3000");
});

app.post('/create-account', createAccount);