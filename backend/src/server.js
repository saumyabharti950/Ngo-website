import app from "./app.js";
import { sequelize } from "./models/index.js";

const port = process.env.PORT || 5000;

sequelize.authenticate().then(() => {
  app.listen(port, () => {
    console.log(`SIFI Foundation API running on http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Database connection failed", error);
  process.exit(1);
});
