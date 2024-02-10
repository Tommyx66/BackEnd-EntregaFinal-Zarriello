//const { getMensajes, saveMensaje } = require('../api/mensajes.js');
const { getMessages, saveMessage } = require('../controller/mesageController.js');

async function messageSocket(client, allSockets) {

    client.on('loadMessages', async productos => {
        client.emit('messages', await getMessages());
    });

    client.on('new-message', async message => {
        const msgAdded = await saveMessage(message);
        allSockets.emit('message-added', msgAdded);
    })
}

module.exports = { messageSocket };
