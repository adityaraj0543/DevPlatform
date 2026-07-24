require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initSockets = require('./sockets');
const logger = require('./utils/logger');

const DEFAULT_PORT = Number(process.env.PORT || 5000);

function startServer(port) {
    const server = http.createServer(app);
    initSockets(server);

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            const nextPort = port + 1;
            logger.warn(`Port ${port} is busy, retrying on ${nextPort}`);
            startServer(nextPort);
            return;
        }

        logger.error('server failed', err);
        process.exit(1);
    });

    server.listen(port, () => logger.info(`API listening on :${port}`));
}

(async() => {
    await connectDB();
    startServer(DEFAULT_PORT);

    process.on('unhandledRejection', (err) => {
        logger.error('unhandledRejection', err);
    });
})();