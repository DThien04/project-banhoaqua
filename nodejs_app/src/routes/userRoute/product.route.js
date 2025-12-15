const express = require("express");
const route = express.Router();
const controller = require("../../controllers/userController/product.controller");
route.get("/:id", controller.getProductById);
route.get("/", controller.getAllProducts);
route.get("/cat/:id", controller.getProductByCategory);
module.exports = route;
