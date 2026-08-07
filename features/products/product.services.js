const Product = require("./product.model");

async function createProductServices(nombre, precio, cantidad_disponible, categoria, descripcion) {
  return await Product.create(nombre, precio, cantidad_disponible, categoria, descripcion);
}

async function deleteProductServices(id) {
  return await Product.delete(id);
}
async function getProducts() {
  return await Product.findAll();
}

async function getProductByID(id) {
  return await Product.findById(id);
}
async function getProductNameServices(nombre) {
  return await Product.findByName(nombre);
}
async function modifyProductByIDServices(
  nombre,
  precio,
  id,
  cantidad_disponible,
  cantidad_reservada,
  categoria,
  descripcion,
) {
  return await Product.update(
    nombre,
    precio,
    cantidad_disponible,
    cantidad_reservada,
    categoria,
    descripcion,
    id,
  );
}

module.exports = {
  createProductServices,
  deleteProductServices,
  getProducts,
  getProductByID,
  getProductNameServices,
  modifyProductByIDServices,
};

