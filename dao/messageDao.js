const { MongoClient, ServerApiVersion } = require('mongodb');
const { urlAtlas, mongoDBase } = require('../environment.js');

function connectAtlas() {
    const client = new MongoClient(
        urlAtlas,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1
        }
    );
    return client;
}

async function searchMessages() {
    const client = connectAtlas();
    const databaseAtlas = client.db(mongoDBase);
    const collectionMensajes = databaseAtlas.collection("mensajes");

    try {
        const options = {
            sort: { name: 1 }, // sort returned documents in ascending order by name (A->Z).
        };
        const documents = await collectionMensajes.find({}, options).toArray(); //Si no hay resultados find retornara un arreglo vacio [].
        return documents;
    } catch (error) {
        console.log(error);
        return -1; // Para retornar estado de error durante la consulta se retorna (-1) en numero.
    } finally {
        await client.close();
    }
}

async function searchAuthorMessages(msgAuthor) {
    const client = connectAtlas();
    const databaseAtlas = client.db(mongoDBase);
    const collectionMensajes = databaseAtlas.collection("mensajes");

    try {
        const query = { autor: msgAuthor };
        const documents = await collectionMensajes.find(query).toArray(); //Si no hay resultados find retornara un arreglo vacio [].
        return documents;
    } catch (error) {
        console.log(error);
        return -1; // Para retornar estado de error durante la consulta se retorna (-1) en numero.
    } finally {
        await client.close();
    }
}

async function insertMessage(mensaje) {
    const client = connectAtlas();
    const databaseAtlas = client.db(mongoDBase);
    const collectionProductos = databaseAtlas.collection("mensajes");
    try {
        const cursorAtlas = await collectionProductos.insertOne(mensaje); // Retorna objeto resultado con acknowledged:boolean e insertedId:string.
        return cursorAtlas;
    } catch (error) {
        console.log(error);
        return -1; // Para retornar estado de error durante la consulta se retorna (-1) en numero.
    } finally {
        await client.close();
    }
}

module.exports = { searchMessages, insertMessage, searchAuthorMessages }
