# Secure Messaging App

This project is a messaging app with communication between user and server. The  goal is to build a simple project without thinking about security threats, and then to find security issues, document them and fix them. It is designed for security purposes, no production.

## Tech used
Node.js, Typescript, Express, SQLite

## Features
- User registration & login
- Local SQLite database
- Password hashing (bcrypt)
- CBC encryption and decryption

## Project structure:
```
| makefile
| package-lock.json
| package.json
| .env
| cookies.txt
| tsconfig.json
|
+---data
|       app.db
+---native
|       message-check.c
\---src
    |   auth.ts
    |   crypto.ts
    |   db.ts
    |   message.ts
    |   server.ts
    |   util.ts
    |
    \---types
            session.d.ts
```

## Vulnerabilities 
TODO : complete this section
More details can be found in vulnerabilities.md

## How to run
TODO : complete this section.

Use ```make run``` to start the server.
Server runs on http://localhost:3000/

## Commands
I will be using curl to communicate with the server. Cookies are stored in the cookies.txt file, which is created with ```-c cookies.txt```. For this reason, to keep track of the user logged in, use ```-c cookies.txt``` when logging in, and ```-b cookies.txt``` to stay authenticated. The file uses a session cookie to keep track if a user is logged in. Note : this is only for testing purposes.

**Create account** :  
```curl -X POST http://localhost:3000/create-account -H "Content-Type: application/json" -d '{"username":"bob", "password":"secret"}'```

**Login** :  
```curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"bob","password":"secret"}' -c cookies.txt```

**Send message** :  
```curl -X POST http://localhost:3000/send -H "Content-Type: application/json" -d '{"from":1, "to": 2, "content": "Hello"}' -b cookies.txt```

**Read discussion** :  
```curl -X POST http://localhost:3000/discussion -H "Content-Type: application/json" -d '{"user1":1, "user2": 2}' -b cookies.txt```

<br>

We can also get the logs of our discussions, which could be usefull to export the data.

**Get logs** :  
```curl -X POST http://localhost:3000/logs -H "Content-Type: application/json" -d '{"from": 1, "uid":1}' -b cookies.txt```

<br>

The logs come raw, to have a formatted version, use read-logs.

**Read logs** :  
```curl -X POST http://localhost:3000/read-logs -H "Content-Type: application/json" -d '{"logs": [...]}' -b cookies.txt```
