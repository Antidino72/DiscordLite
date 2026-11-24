import { http } from "./app.js";
import dotenv from "dotenv";
dotenv.config();
http.listen(process.env.PORT, () => {
    console.log('Server running on http://localhost:' + process.env.PORT);
});
//# sourceMappingURL=index.js.map