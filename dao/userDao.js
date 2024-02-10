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

async function getUser(usr) {
    const client = connectAtlas();
    const databaseAtlas = client.db(mongoDBase);
    const collectionUsuarios = databaseAtlas.collection("users");

    let result;
    try {
        const query = { user: usr };
        result = await collectionUsuarios.findOne(query);
    } finally {
        await client.close();
    }
    return result; //Null si usuario no existe - Objeto usuario si se encuentra en la DB.  
}

async function addUser(docUsr) {
    const client = connectAtlas();
    const databaseAtlas = client.db(mongoDBase);
    const collectionUsuarios = databaseAtlas.collection("users");

    let result = null;
    let estado = -1;
    try {
        result = await collectionUsuarios.insertOne(docUsr);
        estado = 0;
    } catch (error) {
        console.log('Error:', err.message);
    }
    finally {
        await client.close();
        return { status: estado, id: result.insertedId };
    }
}

module.exports = { getUser, addUser };
