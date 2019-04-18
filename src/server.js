import './app/configs/database';
import params from './app/configs/params';
import http from 'http';
import App from './app/app';
const PID = process.pid;

const server = http.createServer(App());

export const io = require('socket.io')(server);

server.listen(params.apiPort, () => {
    console.info(`Listening ${server.address().port} port. Process: ${PID}`);
});
