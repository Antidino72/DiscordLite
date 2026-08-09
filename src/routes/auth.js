// API Endpoint: Google Login Handler


const queries = require('../db/queries');
const route = require("express").Router();
route.post('/login', async (req, res) => {
    const {google_id, username, image} = req.body;

    if (!google_id || !username || !image) {
        return res.status(400).json({error: 'Incomplete data provided'});
    }
    try {
        // Find existing user or register new one
        let user = await queries.findGoogleId(google_id);


        if (!user) {
            const result =await queries.insertUser(username, google_id, image);
            user = {
                id: result.lastInsertRowid,
                username: username,
                image: image,
                google_id: google_id
            };
        }
        // Save user info in session
        req.session.user = {
            id: user.id,
            username: user.username,
            image: user.image
        };

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

route.get('/me', (req, res) => {
    if (req.session && req.session.user) {
        // On renvoie les infos stockées dans la session
        console.log(req.session.user)
        res.json({
            logged: true,
            user: req.session.user
        });
    } else {
        res.status(401).json({ logged: false, error: 'Non connecté' });
    }
});
module.exports = route;