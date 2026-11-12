import app from "./app.js";
import { sequelize } from "./models/index.js";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`SIFI Foundation API running on http://localhost:${port}`);
});

sequelize.authenticate().then(() => {
  console.log("Database connected successfully");
}).catch((error) => {
  console.error("Database connection failed:", error.message);
});
