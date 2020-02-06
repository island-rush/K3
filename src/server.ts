import connectAzuretables, { AzureTableStoreFactory } from 'connect-azuretables';
import connectRedis, { RedisStore } from 'connect-redis';
import express, { Application, Request, RequestHandler, Response } from 'express';
import session, { SessionOptions } from 'express-session';
import sharedsession from 'express-socket.io-session';
import http, { Server } from 'http';
import redis, { ClientOpts, RedisClient } from 'redis';
import { Socket } from 'socket.io';
import redisAdapter from 'socket.io-redis';
import { router } from './server/router';
import { socketSetup } from './server/socketSetup';

// Create the server
const app: Application = express();
const server: Server = http.createServer(app);

// Redis Clients (possibly) used on both sessions and sockets, define options for both here
const redisClientOptions: ClientOpts = {
    auth_pass: process.env.REDISCACHEKEY,
    tls: { servername: process.env.REDISCACHEHOSTNAME }
};

// Session Setup (3 possible types)
let fullSession: RequestHandler;
const fullSessionOptions: SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
};

// Create session store (based on env type)
if (process.env.SESSION_TYPE === 'azure' && process.env.AZURE_STORAGE_CONNECTION_STRING !== '') {
    const AzureTablesStoreFactory: AzureTableStoreFactory = connectAzuretables(session);

    fullSession = session({
        store: AzureTablesStoreFactory.create({ sessionTimeOut: 120 }),
        ...fullSessionOptions
    });
} else if (process.env.SESSION_TYPE === 'redis' && process.env.REDISCACHEHOSTNAME !== '' && process.env.REDISCACHEKEY !== '') {
    const RedisSessionStore: RedisStore = connectRedis(session);
    const redisClient: RedisClient = redis.createClient(6380, process.env.REDISCACHEHOSTNAME, { ...redisClientOptions, prefix: 'session' });

    fullSession = session({
        store: new RedisSessionStore({ client: redisClient }),
        ...fullSessionOptions
    });
} else {
    // LokiStore session uses session-store.db file in root directory -> Probably best for single-instance or offline development
    // Required instead of imported because missing type declarations
    const LokiStore = require('connect-loki')(session);

    fullSession = session({
        store: new LokiStore(),
        ...fullSessionOptions
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

// Socket's use Redis Cache to talk between server instances (not needed on development / single instance)
// Note: .env variables parsed as strings
if (process.env.REDIS_SOCKETS !== 'false' && process.env.REDISCACHEHOSTNAME !== '' && process.env.REDISCACHEKEY !== '') {
    const pub = redis.createClient(6380, process.env.REDISCACHEHOSTNAME, redisClientOptions);
    const sub = redis.createClient(6380, process.env.REDISCACHEHOSTNAME, redisClientOptions);

    io.adapter(redisAdapter({ pubClient: pub, subClient: sub }));
}

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
