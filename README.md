# Discord Lite

A lightweight Discord clone built to learn **Node.js**, **Express**, **Socket.IO**, and **PostgreSQL**.

## Screenshots

![login](./screenshots/login.png)
![chat](./screenshots/chat.png)

## Features and Security

- **Google OAuth2 Login:** Passwordless auth handled on the server.
- **Real-time Messaging:** WebSockets powered by Socket.IO.
- **Session Security:** Session IDs stored in `HttpOnly` and `SameSite` cookies, reducing the risk of session theft through XSS.
- **Persistent Data:** Message history saved in PostgreSQL.
- **API Protection:** Rate limiting on auth endpoints to prevent spam.

## ️ Tech Stack

- **Server:** Node.js, Express.js, Socket.IO, express-session
- **Database:** PostgreSQL
- **Auth:** Google Auth Library (`google-auth-library`)
- **Frontend:** HTML, CSS, Vanilla JS

## Requirement

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- Google Cloud Console Client ID

## Start

```

git clone https://github.com/Antidino72/DiscordLite

cd discord-lite

//modifie .env.exemple to .env and modify entry
npm install


npm start

```

and Open http://localhost:3000 in your browser.

## To do list

* [X]  Google OAuth2 & Secure Cookies
* [X]  Real-time messaging
* [X]  Message history (PostgreSQL)
* [X]  Session cleanup / Logout
* [ ]  Online members list & status
* [ ]  Smart auto-scroll & sound notifications
* [ ]  Markdown parsing
* [ ]  Image & link previews
* [ ]  Mobile responsive

## .env

check .env.exemple

## Status

Work in progress
