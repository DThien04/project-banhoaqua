const express = require("express");
const route = express.Router();
const controller = require("../../controllers/userController/category.controller");
route.get("/:id", controller.getCategoryDetails);
route.get("/", controller.getAllCategories);
module.exports = route;
