const { searchCarrito, insertCarrito, searchCarritoById, searchCarritoByUser, deleteCarrito, updateCarrito } = require('../dao/carritoDao.js');

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

async function getCarritos(){
    const carritos = await searchCarrito();
    let datosActualizados;

    if (carritos.length !== 0) {
        datosActualizados = carritos.map(objeto => {
            const nuevoObjeto = { ...objeto };
            nuevoObjeto._id = objeto._id.toString(); // Convertir ObjectId a string
            return nuevoObjeto;
        });
        return datosActualizados;
    }
    if (carritos === -1) {
        return -1;
    } else {
        return [];
    }
}

async function getCarritoById(id){
    const carrito = await searchCarritoById(id);
    if(carrito != null){
        return carrito;
    } else {
        return -1;
    }
}

async function getCarritoByUser(usr_id){
    const carrito = await searchCarritoByUser(usr_id);
    if(carrito != null){
        return carrito;
    } else {
        return -1;
    }
}

async function saveCarrito(carrito){
    const now = getTime();
    const newCarrito = { timeStamp: now, ...carrito };
    
    const carritoAdded = await insertCarrito(newCarrito);

    if(carritoAdded.acknowledged){
        let id = carritoAdded.insertedId.toString();
        return { _id: id, ...newCarrito };
    } else {
        return -1;
    }
}

async function eliminarCarrito(){
}

async function actualizarCarrito(){
}

module.exports = { getCarritos, getCarritoById, getCarritoByUser, saveCarrito, eliminarCarrito, actualizarCarrito };