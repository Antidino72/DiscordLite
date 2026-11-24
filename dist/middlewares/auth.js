const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
async function requireAuth(req, res, next) {
}
module.exports = {
    requireAuth: requireAuth,
};
export {};
//# sourceMappingURL=auth.js.map