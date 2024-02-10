const dotenv = require('dotenv');
const yargs = require('yargs');

dotenv.config();

const argv = yargs
  .option('serverPort', { alias: 'p', description: 'Port number to use for the server', type: 'number', default: 3000 })
  .help()
  .alias('help', 'h')
  .argv;

// Override the value of .ENV fiele if command options are specified.
if (argv['serverPort']) { process.env.SERVER_PORT = argv['serverPort']; }

const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const mongoDBase = process.env.MONGO_DB;
const urlAtlas = `mongodb+srv://ecommerce_coder:zxcasdqwe123@cluster0.fd4ltuz.mongodb.net/`;

const serverPort = process.env.SERVER_PORT;
const sessionSecret = process.env.SESSION_SECRET;
const jwtPrivateKey = process.env.JWT_PRIVATEKEY;
const jwtExpiration = process.env.JWT_EXPIRATION;

module.exports = { serverPort, sessionSecret, jwtPrivateKey, jwtExpiration, urlAtlas, mongoDBase };
