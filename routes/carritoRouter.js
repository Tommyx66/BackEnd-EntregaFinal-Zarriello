const Router = require('express');
const { getCarritos, getCarritoById, getCarritoByUser, saveCarrito, eliminarCarrito, actualizarCarrito } = require('../controller/carritoController.js');

const carritoRouter = new Router();

carritoRouter.get('/api/carritos', async (req, res) => {
    const carritos = await getCarritos();
    res.json(carritos);
});

carritoRouter.get('/api/carrito/:id', async (req, res) => {
    const { id } = req.params;
    const carrito = await getCarritoById(id);
    res.json(carrito);
});

carritoRouter.get('/api/carrito/user/:id', async (req, res) => {
    const { id } = req.params;
    const carrito = await getCarritoByUser(id);
    res.json(carrito);
});

carritoRouter.post('/api/carrito', async (req, res) => {
    const parametros = req.body;
    const parametrosExistente = {};
    for (const parametro in parametros) {
        if (parametros.hasOwnProperty(parametro)) {
            parametrosExistente[parametro] = parametros[parametro];
        }
    }
    const addedCarrito = await saveCarrito(parametrosExistente);
    res.json(addedCarrito);
});

carritoRouter.delete('/api/carrito/:id', async (req, res) => {
    const { id } = req.params;
    const eliminado = await eliminarCarrito(id);
    res.json(eliminado);
});

carritoRouter.put('/api/carrito/:id', async (req, res) => {
    const { id } = req.params;
    const parametros = req.body;
    const parametrosExistente = {};
    for (const parametro in parametros) {
        if (parametros.hasOwnProperty(parametro)) {
            parametrosExistente[parametro] = parametros[parametro];
        }
    }
    const updated = await actualizarCarrito(id, parametrosExistente);
    res.json(updated);
});

module.exports = { carritoRouter };
