import {} from "express";
import router from "express";
import { Queries } from "../db/queries.js";
import path from "node:path";
const queries = new Queries();
const route = router.Router();
route.get('/messages', async (req, res) => {
    const beforeId = req.query.before;
    const afterId = req.query.after;
    const limit = 30;
    let messages;
    if (beforeId) {
        messages = await queries.getMessagesBeforeID(beforeId, limit);
        return res.json({ messages });
    }
    else if (afterId) {
        messages = await queries.getMessagesAfterID(afterId, limit);
    }
    else {
        // Derniers messages pour le premier chargement
        messages = await queries.getMessages(limit);
        return res.json({ messages });
    }
});
route.get('/image/:id', async (req, res) => {
    const imageId = req.params.id;
    if (!imageId) {
        return res.status(400).send("No id found in your request");
    }
    switch (imageId) {
        case 'send':
            return res.status(200).sendFile(path.join(__dirname, '../../public/assets/chat/image/send.png'));
        case 'logo':
            return res.status(200).sendFile(path.join(__dirname, '../../public/assets/chat/image/logo.png'));
        default:
            return res.status(404).send(`Not Found : ${imageId}`);
    }
});
route.get("/users", async (req, res) => {
    res.status(200).json({ ok: "true" });
});
export default route;
//# sourceMappingURL=ChatAPI.js.map