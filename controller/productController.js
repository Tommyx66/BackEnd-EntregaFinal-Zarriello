const { searchProducts, insertProduct, searchProductById, deleteProduct, updateProduct } = require('../dao/productDao.js');
const Product = require('../models/productModel')

async function getProducts(){
    const products = await searchProducts();
    let datosActualizados;

    if (products.length !== 0) {
        datosActualizados = products.map(objeto => {
            const nuevoObjeto = { ...objeto };
            nuevoObjeto._id = objeto._id.toString(); // Convertir ObjectId a string
            return nuevoObjeto;
        });
        return datosActualizados;
    }
    if (products === -1) {
        return -1;
    } else {
        return [];
    }
}

async function getProductsById(id){
    const product = await Product.searchProductById(id);

    if(product != null){
        return product;
    } else {
        return -1;
    }
}

async function saveProduct(newProduct){
    const addedProduct = await Product.insertProduct(newProduct);

    if(addedProduct.acknowledged){
        let id = addedProduct.insertedId.toString();
        return { _id: id, ...newProduct };
    } else {
        return -1;
    }
}

async function eliminarProduct(id){
    const deletedProduct = await Product.deleteProduct(id);

    if(deletedProduct.acknowledged){
        return { deleted: id };
    } else {
        return -1;
    }
}

async function actualizarProduct(id, updateValues){
    const updatedProduct = await Product.updateProduct(id, updateValues);

    if(updatedProduct.acknowledged && updatedProduct.modifiedCount == 1){
        return { estado: 0, actualizado: { _id: id, ... updateValues } };
    } else {
        return -1;
    }
}

module.exports = { getProducts, getProductsById, saveProduct, eliminarProduct, actualizarProduct };
