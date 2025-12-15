const express = require("express");
const route = express.Router();
const controller = require("../../controllers/userController/cart.controller");
route.get("/", controller.getCart);
route.post("/add", controller.addToCart);
route.delete("/remove/:productId", controller.removeFromCart);
route.patch("/update", controller.updateQuantity);
module.exports = route;
