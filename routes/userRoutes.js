const Router = require('express');
const { loginUser, registerUser } = require('../controller/userController.js');

const userRouter = new Router()

userRouter.post('/login', async (req, res) => {
    const usr = req.body.user;
    const pwd = req.body.pass;

    const response = await loginUser(usr, pwd);
    res.json(response);
});

userRouter.post('/register', async (req, res) => {
    const parametros = req.body;
    const parametrosExistente = {};
    for (const parametro in parametros) {
        if (parametros.hasOwnProperty(parametro)) {
            parametrosExistente[parametro] = parametros[parametro];
        }
    }

    const response = await registerUser(parametrosExistente);

    res.json(response);
});

module.exports = { userRouter };
