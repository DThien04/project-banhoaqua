const productRoute = require("./product.route");
const categoryRoute = require("./category.route")
const cartRoute = require("./cart.route")
module.exports = (app) => {
  app.use("/v1/api/cart", cartRoute);
  app.use("/v1/api/product", productRoute);
  app.use("/v1/api/category", categoryRoute);
};
