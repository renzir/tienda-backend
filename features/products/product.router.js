const express = require("express");
const verificarDatosProducts = require("../../middleware/verificarDatosProducts");
const verficarIDParams = require("../../middleware/verficarIDParams");
const getProductsController = require("./product.get.controller");
const getProductByIDController = require("./product.getByID.controller");
const modifyProductController = require("./product.modify.controller");
const createProductController = require("./product.create.controller");
const deteleProductController = require("./product.detele.controller");
const verificarCreateProduct = require("../../middleware/verificarCreateProduct");


const app = express.Router();

app.get("/getProducts", getProductsController);

app.get("/getProductById/:id", verficarIDParams, getProductByIDController);

app.patch("/modifyProduct", verificarDatosProducts, modifyProductController);

app.post("/createProduct", verificarCreateProduct, createProductController);

app.delete("/deteleProduct/:id", verficarIDParams, deteleProductController);
module.exports = app;
