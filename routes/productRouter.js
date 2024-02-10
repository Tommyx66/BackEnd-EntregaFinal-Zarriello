const Router = require('express');
const { getProducts, getProductsById, saveProduct, eliminarProduct, actualizarProduct } = require('../controller/productController.js');

const productRouter = new Router();

productRouter.get('/api/productos', async (req, res) => {
    const productos = await getProducts();
    res.json(productos);
});

productRouter.get('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const producto = await getProductsById(id);
    res.json(producto);
});

productRouter.post('/api/productos', async (req, res) => {
    const parametros = req.body;
    const parametrosExistente = {};
    for (const parametro in parametros) {
        if (parametros.hasOwnProperty(parametro)) {
            parametrosExistente[parametro] = parametros[parametro];
        }
    }
    const addedProduct = await saveProduct(parametrosExistente);
    res.json(addedProduct);
});

productRouter.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const eliminado = await eliminarProduct(id);
    res.json(eliminado);
});

productRouter.put('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const parametros = req.body;
    const parametrosExistente = {};
    for (const parametro in parametros) {
        if (parametros.hasOwnProperty(parametro)) {
            parametrosExistente[parametro] = parametros[parametro];
        }
    }
    const updated = await actualizarProduct(id, parametrosExistente);
    res.json(updated);
});

module.exports = { productRouter };
