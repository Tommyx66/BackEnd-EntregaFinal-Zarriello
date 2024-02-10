const Router = require('express');
const { getMessages, getMessagesByAutor, saveMessage } = require('../controller/mesageController.js');

const messageRouter = new Router();

messageRouter.get('/api/mensajes', async (req, res) => {
    const response = await getMessages();
    res.json(response);
});

messageRouter.get('/api/mensajes/:msgAutor', async (req, res) => {
    const { msgAutor } = req.params;
    const response = await getMessagesByAutor(msgAutor);
    res.json(response);
});

messageRouter.post('/api/mensajes', async (req, res) => {
    const newMessage ={
        autor : req.body.autor,
        mensaje : req.body.message
    }

    const response = await saveMessage(newMessage);
    res.json(response);
});

module.exports = { messageRouter };