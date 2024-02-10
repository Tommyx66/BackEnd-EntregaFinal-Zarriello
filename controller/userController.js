const bcrypt = require('bcrypt');
const { getUser, addUser } = require('../dao/userDao.js');
const { generateToken } = require('../controller/jwtAuthController.js');

function encrypt(plainText) {
    bcrypt.hash(plainText, 5)
        .then(hash => {
            return hash;
        })
        .catch(err => {
            console.error(err);
            return -1;
        });
}

async function loginUser(usrName, pwd) {
    const storedUser = await getUser(usrName);

    if (storedUser != null) {
        try {
            const payLoad = {
                usrid: storedUser._id,
                user: storedUser.user,
                mail: storedUser.mail,
                level: storedUser.rol
            };

            const result = await bcrypt.compare(pwd, storedUser.passwd);
            if (result) {
                // La contraseña coincide
                const token = generateToken(payLoad);
                return { estado: 0, token: token, user: payLoad };
            } else {
                // La contraseña no coincide
                return { estado: 1, mensaje: "LogIn Error Contraseña\n\nIntente nuevamente !!" };
            }
        } catch (error) {
            // Manejar el error
            console.log("Error en la decriptacion del pasword --> ...");
            console.log(error);
            return { estado: 1, mensaje: `ERROR INESPERADO\n\nINTENTE NUEVAMENTE` };
        }
    } else {
        return { estado: 1, mensaje: "LogIn Error Usuario\n\nIntente nuevamente" };
    }
}

async function registerUser(newUsr){
    const storedUser = await getUser(newUsr.user);

    if (storedUser == null) {
        try {
            const hash = await bcrypt.hash(newUsr.pass, 5);
            let inserted = await addUser({ user: newUsr.user, passwd: hash, age: newUsr.age, mail: newUsr.mail, phone: newUsr.phone, rol: 0 }); //por defecto el rol es 0 - usuario normal
            if (inserted.status == 0) { return { estado: 0, mensaje: `USUARIO INSERTADO CON EXITO !!\n\nID: ${inserted.id}` }; }
            if (inserted.status == -1) { return { estado: 1, mensaje: `ERROR AL AGREGAR USUARIO !!\n\nINTENTE NUEVAMENTE` }; }
        } catch (error) {
            return { estado: 1, mensaje: `ERROR INESPERADO - INTENTE NUEVAMENTE` };
        }
    } else {
        return { estado: 1, mensaje: `ERROR USUARIO EXISTENTE` };
    }
}

module.exports = { loginUser, registerUser };
