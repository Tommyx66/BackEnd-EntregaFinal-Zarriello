const jwt = require('jsonwebtoken');
const { jwtPrivateKey, jwtExpiration } = require('../environment.js');

function generateToken(payLoad) {
    const token = jwt.sign(payLoad, jwtPrivateKey, { expiresIn: jwtExpiration }); // con expiracion.
    return token;
}

async function verifyToken(token) {
    try {
        const decoded = await jwt.verify(token, jwtPrivateKey);

        // Verificar la expiración del token
        if (Date.now() >= decoded.exp * 1000) {
            throw new Error('El token ha expirado');
        }
        return { estado: 0, data: decoded };
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return { estado: 1, mensaje: "Token Expirado" }; //expirado
        } else {
            return { estado: 1, mensaje: "Token Invalido" }; //invalido
        }
    }
}

async function isAuthenticated(req, res, next) {
    const token = req.headers.authorization;

    // Verificar si el token existe
    if (!token) {
        return res.status(401).json({ estado: 1, mensaje: 'Error de Autenticacion\n\nTOKEN INEXISTENTE' });
    }
    try {
        // Verificar y decodificar el token
        const decoded = await verifyToken(token);
        if (decoded.estado == 0) {
            // Almacenar el ID del usuario en el objeto de solicitud para uso posterior
            req.userid = decoded.data.userid;
            req.user = decoded.data.user;
            req.mail = decoded.data.mail;
            req.level = decoded.data.level;
            req.token = token;
        }
        // Continuar con la ejecución de la ruta protegida
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Error Inesperado - Intente nuevamente' });
    }
}

module.exports = { generateToken, isAuthenticated };
