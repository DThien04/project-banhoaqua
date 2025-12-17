const express = require("express");
const dotenv = require("dotenv");
const database = require("./configs/database.js");


const Router = require("./src/api/v1/routers/index.routers");
const cookieParser = require("cookie-parser");
const { errorMiddleware } = require("./src/api/v1/middlewares/error.middleware");
const { notFoundMiddleware } = require("./src/api/v1/middlewares/notFound.middleware");
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// KHÔNG cần body-parser nữa, express có sẵn
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

database.connect();
const userRoute = require("./routes/userRoute/index.route.js");
const adminRoute = require("./routes/adminRoute/index.route.js");
//cors
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// Router Version 1
Router(app);

// 404 sau routes
app.use(notFoundMiddleware);



userRoute(app);
adminRoute(app);


// error handler CUỐI CÙNG
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
