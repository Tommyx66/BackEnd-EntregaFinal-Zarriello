const { serverPort } = require('./environment.js');
const { loggerDefault } = require('./logs/log4js.js');
const path = require('path');  // Para el uso de rutas filePaths absolutos.
const { isAuthenticated } = require('./controller/jwtAuthController.js');

const express = require('express');
const { createServer } = require('http');
const socketIo = require('socket.io');

const { userRouter } = require('./routes/userRoutes.js');
const { messageRouter } = require('./routes/messageRouter.js');
const { productRouter } = require('./routes/productRouter.js');
const { carritoRouter } = require('./routes/carritoRouter.js');

const { messageSocket } = require('./webSocket/mensajesWS.js');

const { mainPage, adminPage } = require('./pages/loadPages.js');

const app = express();
const server = createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ----- PLANTILLA HANDLEBARS -------------------------------------------------- //
const { engine } = require('express-handlebars');
app.set("view engine", "hbs");
app.set("views", `${path.join(__dirname, './handlebars/views')}`);
app.engine('hbs', engine({ extname: ".hbs", defaultLayout: 'index.hbs' }));

app.get('/info', (req, res) => {
    const arrayInfo = [
        { key: 'ID de Proceso', value: process.pid },
        { key: 'Puerto Servidor', value: server.address().port },
        { key: 'Path de Ejecucion', value: process.cwd() },
        { key: 'Nombre de Plataforma', value: process.platform },
        { key: 'Version de Node', value: process.version },
        { key: 'Uso de Memoria', value: JSON.stringify(process.memoryUsage()) }
    ];
    res.render("vista", { info: arrayInfo, hayInfo: arrayInfo.length });
});
// ----- PLANTILLA HANDLEBARS -------------------------------------------------- //

function getContentType(ext) {
    switch (ext) {
        case 'css':
            return 'text/css';
        case 'js':
            return 'application/javascript';
        default:
            return 'text/html';
    }
}

app.use(express.static(`${path.join(__dirname, `public`)}`, {
    setHeaders: (res, path, stat) => {
        const fileExt = path.split('.').pop();
        const contentType = getContentType(fileExt);
        res.set('Content-Type', contentType);
    }
}));

app.use(userRouter);
app.use(messageRouter);
app.use(productRouter);
app.use(carritoRouter);


app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, './public/registro.html'));
});

app.get('/mainPage', isAuthenticated, (req, res) => {
    const user = {
        usrid: req.user.id,
        user: req.user,
        mail: req.mail,
        level: req.level
    };
    res.header('Authorization', `${req.token}`);
    res.json({user: user, page: mainPage});
});

app.get('/adminPage', isAuthenticated, (req, res) => {
    const user = {
        usrid: req.user.id,
        user: req.user,
        mail: req.mail,
        level: req.level
    };
    if(req.level != 1){
        res.header('Authorization', `${req.token}`);
        res.json({estado: 1, user: user, mensaje: "Permisos Insuficientes\n\nDebe ser Administrador !!"});
    } else {
        res.header('Authorization', `${req.token}`);
        res.json({user: user, page: adminPage});
    }
});



io.on('connection', async client => {
    loggerDefault.trace(`Client ${client.id} connected`);
    messageSocket(client, io.sockets);
});

server.listen(serverPort, () => {
    loggerDefault.trace(`Servidor ejecutandose en puerto ${server.address().port} - PID: ${process.pid}`);
});

server.on("error", error => {
    loggerDefault.trace(`Server cannot START - See log files for reason.`);
    loggerDefault.error(`Server cannot START - reason below:\n${error}`);
});
