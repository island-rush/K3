import connectAzuretables, { AzureTableStoreFactory, AzureTableStoreOptions } from 'connect-azuretables';
import express, { Application, Request, RequestHandler, Response } from 'express';
import session from 'express-session';
import sharedsession from 'express-socket.io-session';
import http, { Server } from 'http';
import { SessionOptions } from 'http2';
import { Socket } from 'socket.io';
import { router } from './server/router';
import { socketSetup } from './server/socketSetup';

// Create the server
const app: Application = express();
const server: Server = http.createServer(app);

// Session Setup (2 possible types)
let fullSession: RequestHandler;
if (process.env.SESSION_TYPE === 'azure') {
    // Azure Sessions uses Azure Storage Account (tables) -> Probably best for auto-scaling with multiple instances
    const AzureTablesStoreFactory: AzureTableStoreFactory = connectAzuretables(session);
    const AzureOptions: AzureTableStoreOptions = {
        sessionTimeOut: 120
    };
    fullSession = session({
        store: AzureTablesStoreFactory.create(AzureOptions),
        secret: process.env.SESSION_SECRET || '@d$f4%ggGG4_*7FGkdkjlk',
        resave: false,
        saveUninitialized: false
    });
} else {
    // LokiStore session uses session-store.db file in root directory -> Probably best for single-instance or offline development
    // Required instead of imported because missing type declarations
    const LokiStore = require('connect-loki')(session);
    const lokiOptions: SessionOptions = {};
    fullSession = session({
        store: new LokiStore(lokiOptions),
        secret: process.env.SESSION_SECRET || '@d$f4%ggGG4_*7FGkdkjlk',
        resave: false,
        saveUninitialized: false
    });
}

// App has access to sessions
app.use(fullSession);

// parses data and puts into req.body
app.use(express.urlencoded({ extended: true }));

// Server Routing
app.use('/', router);

// Statically serve all frontend files
app.use(express.static(`${__dirname}/react-client/build`)); // TODO: Use middleware or reverse proxy to serve static files -> aka, anything with res.sendFile()

// Handle 404 (if no other route is hit in router or static serve)
app.use((req: Request, res: Response) => {
    res.status(404).sendFile(`${__dirname}/server/pages/404.html`);
});

// Socket Setup
export const io: SocketIO.Server = require('socket.io')(server);
// const redisAdapter = require('socket.io-redis');

// This adapter allows socket.io to run centrally between multiple instances, processes, or servers (not needed for local dev)
// if (process.env.REDIS === 'production') {
// io.adapter(redisAdapter({ host: 'localhost', port: 6379 })); // TODO: setup azure redis cache
// }

// Socket has access to sessions
io.use(sharedsession(fullSession));

// Client-Server setup
io.sockets.on('connection', (socket: Socket) => {
    try {
        socketSetup(socket);
    } catch (error) {
        console.error('Unable to setup sockets.');
    }
});

// Start the server
const port = process.env.PORT || '80';
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
