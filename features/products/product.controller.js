const {
  createProductServices,
  getProductNameServices,
  deleteProductServices,
  getProducts,
  getProductByID,
  modifyProductByIDServices,
} = require("./product.services");
async function createProductController(req, res, next) {
  try {
    const { nombre, precio, cantidad_disponible } = req.body;

    const product = await getProductNameServices(nombre);

    if (product)
      return res
        .status(409)
        .json({ success: false, message: "Producto ya existente" });

    const result = await createProductServices(
      nombre,
      precio,
      cantidad_disponible,
    );

    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Producto creado" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Fallo en crear producto" });
    }
  } catch (error) {
    next(error);
  }
}
async function modifyProductController(req, res, next) {
  try {
    const { id, nombre, precio, cantidad_disponible, cantidad_reservada } =
      req.body;

    const product = await getProductByID(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Producto no encontrado" });
    }
    const result = await modifyProductByIDServices(
      nombre,
      precio,
      cantidad_disponible || product.cantidad_disponible,
      cantidad_reservada || product.cantidad_reservada,
      id,
    );

    return res.status(200).json({
      success: true,
      message: "Modificacion existosa",
    });
  } catch (error) {
    next(error);
  }
}

async function deteleProductController(req, res, next) {
  try {
    const { id } = req.params;

    const result = await deleteProductServices(id);

    if (result)
      return res
        .status(200)
        .json({ success: true, message: "Producto eliminado" });

    return res
      .status(404)
      .json({ success: false, message: "Fallo en eliminar producto" });
  } catch (error) {
    next(error);
  }
}

async function getProductsController(req, res, next) {
  try {
    const products = await getProducts();

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No hay productos" });
    }

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductByIDController(req, res, next) {
  try {
    const { id } = req.params;
    const product = await getProductByID(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Producto no encontrado" });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProductController,
  getProductByIDController,
  getProductsController,
  deteleProductController,
  modifyProductController,
};
