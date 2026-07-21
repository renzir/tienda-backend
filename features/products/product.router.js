const express = require("express");
const verificarDatosProducts = require("../../middleware/validateProductUpdate.js");
const verficarIDParams = require("../../middleware/validateProductId.js");
const {
  getProductsController,
  getProductByIDController,
  modifyProductController,
  createProductController,
  deteleProductController,
} = require("./product.controller");
const verificarCreateProduct = require("../../middleware/validateProductCreation.js");

const app = express.Router();

app.get("/getProducts", getProductsController);

app.get("/getProductById/:id", verficarIDParams, getProductByIDController);

app.patch("/modifyProduct", verificarDatosProducts, modifyProductController);

app.post("/createProduct", verificarCreateProduct, createProductController);

app.delete("/deleteProduct/:id", verficarIDParams, deteleProductController);
module.exports = app;
