const express = require("express");
const dotenv = require("dotenv");
const database = require("./configs/database.js");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
database.connect();
const userRoute = require("./routes/userRoute/index.route.js");
const adminRoute = require("./routes/adminRoute/index.route.js");
userRoute(app);
adminRoute(app);
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
