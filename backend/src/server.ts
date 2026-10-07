import { app } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/client.js";

const server = app.listen(env.PORT, () => console.log(`API listening on http://localhost:${env.PORT}`));

const shutdown = () => server.close(() => void pool.end());
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
