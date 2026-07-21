const express = require("express");
const ordersGetController = require("./order.get.controller");
const orderCreateController = require("./order.create.controller");
const verificarOrder = require("../../middleware/validateOrderCreation.js");
const orderGetByIDController = require("./order.getByID.controller");
const verficarIDParams = require("../../middleware/validateProductId.js");
const orderDeteleController = require("./order.detele.controller");
const orderModifyController = require("./order.modify.controller");
const orderAddProductController = require("./actions/order.AddProduct.Controller");
const verficarOrderIDParams = require("../../middleware/validateOrderId.js");
const verficarOrderProductIDParams = require("../../middleware/validateOrderProductIds.js");
const orderRemoveController = require("../orders/actions/order.Remove.controller");
const orderConfirmController = require("./actions/order.Confirm.controller");
const orderCancelController = require("./actions/order.Cancel.Controller");
const getProductController = require("./actions/order.Get.Controller");

const app = express.Router();

app.get("/getOrders", ordersGetController);

app.post("/createOrder", verificarOrder, orderCreateController);

app.get("/getOrder/:id", verficarIDParams, orderGetByIDController);

app.patch("/modifiyOrder", verificarOrder, orderModifyController);

app.delete("/deteleOrder/:id", verficarIDParams, orderDeteleController);

app.post(
  "/:orderid/product/:productid",
  verficarOrderProductIDParams,
  orderAddProductController,
);

app.delete(
  "/:orderid/product/:productid",
  verficarOrderProductIDParams,
  orderRemoveController,
);
app.post("/:id/confirm", verficarIDParams, orderConfirmController);
app.post("/:id/cancel", verficarIDParams, orderCancelController);
app.get("/:id/getProducts", verficarIDParams, getProductController);
module.exports = app;
