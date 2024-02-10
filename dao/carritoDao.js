const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

async function searchCarrito(){
    const client = connectAtlas();
    const databaseAtlas = client.db(mongoDBase);
    const collectionCarritos = databaseAtlas.collection("carritos");

    try {
        const documents = await collectionCarritos.find({}).toArray(); //Si no hay resultados find retornara un arreglo vacio [].
        return documents;
    } catch (error) {
        console.log(error);
        return -1; // Para retornar estado de error durante la consulta se retorna (-1) en numero.
    } finally {
        await client.close();
    }
}

async function insertCarrito(carrito){
    const client = connectAtlas();
    const databaseAtlas = client.db(mongoDBase);
    const collectionCarritos = databaseAtlas.collection("carritos");
    
    carrito.user = new ObjectId(carrito.user);
    try {
        const cursorAtlas = await collectionCarritos.insertOne(carrito); // Retorna objeto resultado con acknowledged:boolean e insertedId:string.
        return cursorAtlas;
    } catch (error) {
        console.log(error);
        return -1; // Para retornar estado de error durante la consulta se retorna (-1) en numero.
    } finally {
        await client.close();
    }
}

async function searchCarritoById(id){
    const client = connectAtlas();
    const databaseAtlas = client.db(mongoDBase);
    const collectionCarritos = databaseAtlas.collection("carritos");

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collectionCarritos.findOne(query);
        if (result != null) {
            return result;
        } else {
            return -1;
        }
    } finally {
        await client.close();
    }
}

async function searchCarritoByUser(user_id){
    const client = connectAtlas();
    const databaseAtlas = client.db(mongoDBase);
    const collectionCarritos = databaseAtlas.collection("carritos");

    try {
        const query = { user: new ObjectId(user_id) };
        const result = await collectionCarritos.findOne(query);
        if (result != null) {
            return result;
        } else {
            return -1;
        }
    } finally {
        await client.close();
    }
}

async function deleteCarrito(){
}

async function updateCarrito(){
}

module.exports = { searchCarrito, insertCarrito, searchCarritoById, searchCarritoByUser, deleteCarrito, updateCarrito }