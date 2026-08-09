const route = require("express").Router();
const queries = require("../db/queries");

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
module.exports = route;