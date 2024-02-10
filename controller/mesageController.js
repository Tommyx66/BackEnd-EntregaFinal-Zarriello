const { searchMessages, insertMessage, searchAuthorMessages } = require('../dao/messageDao.js');

function getTime() {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return datetime;
}

async function getMessages(){
    const messages = await searchMessages();
    let datosActualizados;

    if (messages.length !== 0) {
        datosActualizados = messages.map(objeto => {
            const nuevoObjeto = { ...objeto };
            nuevoObjeto._id = objeto._id.toString(); // Convertir ObjectId a string
            return nuevoObjeto;
        });
        return datosActualizados;
    }
    if (messages === -1) {
        return -1;
    } else {
        return [];
    }
}

async function getMessagesByAutor(autor){
    const messages = await searchAuthorMessages(autor);
    let datosActualizados;

    if (messages.length !== 0) {
        datosActualizados = messages.map(objeto => {
            const nuevoObjeto = { ...objeto };
            nuevoObjeto._id = objeto._id.toString(); // Convertir ObjectId a string
            return nuevoObjeto;
        });
        return datosActualizados;
    }
    if (messages === -1) {
        return -1;
    } else {
        return [];
    }
}

async function saveMessage(message){
    const now = getTime();
    const newMsg = { timestamp: now, ...message };

    const messages = await insertMessage(newMsg);

    if(messages.acknowledged){
        let id = messages.insertedId.toString();
        return { _id: id, ...newMsg };
    } else {
        return -1;
    }
}

module.exports = { getMessages, getMessagesByAutor, saveMessage };
