const http = require("./src/app").http
require('dotenv').config();


http.listen(process.env.PORT, () => {
    console.log('Server running on http://localhost:'+process.env.PORT);
});