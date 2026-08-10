const route = require("express").Router();
const queries = require("../db/queries");
const path = require("node:path");

route.get('/messages', async (req, res) => {
    const beforeId = req.query.before;
    const afterId = req.query.after;
    const limit = 30;

    let messages;
    if (beforeId) {
        // Sélectionne les messages plus anciens que beforeId
        messages = await queries.getMessagesBeforeID(beforeId, limit)
        return res.json({messages});
    } else if (afterId) {
        messages = await queries.getMessagesAfterID(afterId, limit)
    } else {
        // Derniers messages pour le premier chargement
        messages = await queries.getMessages(limit)
        return res.json({messages});
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
route.get("/user",async (req, res) => {
    res.status(200).json(await queries.getUserList())
})
module.exports = route;