import express, { type Request, type Response } from 'express';

import { rateLimit } from "express-rate-limit";
import { initDb } from "./db/index.js";
import dotenv from "dotenv";
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

export const app = express();
import http_module from "http"

export const http = http_module.createServer(app);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
      message: {
    error: 'Too many requests, please try again later.',
        retryAfter: 900
    },
    standardHeaders: true,
    legacyHeaders: false,
    limit: 10
});

initDb()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', async (req: Request, res: Response) => {
    res.json({
        message: "hi"
    });
});


app.use((req: Request, res: Response, next) => {
    if (req.method === "POST" && !req.is("application/json")) {
        return res.status(415).json({
            error: "Unsupported Media Type",
            message: "Content-Type doit être application/json",
        });
    }
    next();
});

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}



//==================================
//          Limiter
//===================================
app.use('/api/', limiter);

//===================================
//          Route
//===================================


import authRoute from './routes/authAPI.js';
import chatRoute from "./routes/ChatAPI.js"


app.use('/api', authRoute);
app.use('/api', chatRoute);
