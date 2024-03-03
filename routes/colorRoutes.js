const express = require("express");
const {
  createColorCtrl,
  colorList,
  getColor,
  updateColor,
  deleteColor,
} = require("../controllers/colorController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const colorRoutes = express.Router();

colorRoutes.post("/create", authMiddleware, adminMiddleware, createColorCtrl);
colorRoutes.get("/", colorList);
colorRoutes
  .route("/:id")
  .get(getColor)
  .put(authMiddleware, adminMiddleware, updateColor)
  .delete(authMiddleware, adminMiddleware, deleteColor);

module.exports = colorRoutes;
