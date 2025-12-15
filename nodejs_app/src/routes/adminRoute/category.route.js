const express = require("express");
const route = express.Router();
const controller = require("../../controllers/adminController/category.controller");
route.get("/:id", controller.getCategoryDetails);
route.get("/", controller.getAllCategories);
route.post("/create", controller.createNewCategory);
route.put("/edit", controller.updateCategory);
route.delete("/delete/:id", controller.deleteCategory);
route.patch("/toggle/:id",controller.toggleCategoryActive)
module.exports = route;
