import type { NextFunction } from "express";

const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function requireAuth(req: Request, res : Response, next : NextFunction) {

}

module.exports = {
    requireAuth: requireAuth,
};