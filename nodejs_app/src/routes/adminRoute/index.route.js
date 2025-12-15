const userRoute = require("./user.route");
const categoryRoute = require("./category.route");
const productRoute = require("./product.route");
const auth = require("../../middleware/auth");
module.exports = (app) => {
  app.use("/v1/api/admin/user", auth, userRoute);
  app.use("/v1/api/admin/category", auth, categoryRoute);
  app.use("/v1/api/admin/product", auth, productRoute);
};
