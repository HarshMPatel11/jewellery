import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./config/db.js";
import { seedDefaults } from "./config/seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const port = Number(process.env.PORT) || 5000;

connectDb()
  .then(seedDefaults)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
