const route = require("express").Router();
const queries = require("../db/queries");

route.get('/messages', (req, res) => {
    const beforeId = req.query.before;
    const afterId = req.query.after;
    const limit = 30;

    let messages;
    if (beforeId) {
        // Sélectionne les messages plus anciens que beforeId
        messages = queries.getMessagesBeforeID.all(beforeId,limit).reverse()
        return res.json({messages});
    } else if (afterId) {
        messages = queries.getMessagesAfterID.all(afterId,limit)
    }else {
        // Derniers messages pour le premier chargement
        messages = queries.getMessages.all(limit).reverse();
        return res.json({messages});
    }
});
module.exports = route;