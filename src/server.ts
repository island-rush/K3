import connectAzuretables, { AzureTableStoreFactory, AzureTableStoreOptions } from 'connect-azuretables';
import express, { Application, Request, RequestHandler, Response } from 'express';
import session from 'express-session';
import sharedsession from 'express-socket.io-session';
import http, { Server } from 'http';
import { SessionOptions } from 'http2';
import redis, { ClientOpts } from 'redis';
import { Socket } from 'socket.io';
import connectRedis, { RedisStoreOptions } from 'connect-redis';
import redisAdapter from 'socket.io-redis';
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
} else if (process.env.SESSION_TYPE === 'redis' && process.env.REDIS_ACTIVE) {
    const RedisStore = connectRedis(session);
    const redisClientOptions: ClientOpts = {
        auth_pass: process.env.REDISCACHEKEY,
        tls: { servername: process.env.REDISCACHEHOSTNAME },
        prefix: 'session'
    };
    const redisClient = redis.createClient(6380, process.env.REDISCACHEHOSTNAME, redisClientOptions);
    const redisOptions: RedisStoreOptions = { client: redisClient };

    fullSession = session({
        store: new RedisStore(redisOptions),
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

// Socket's use Redis Cache to talk between server instances
if (process.env.REDIS_ACTIVE) {
    const clientOptions: ClientOpts = {
        auth_pass: process.env.REDISCACHEKEY,
        tls: { servername: process.env.REDISCACHEHOSTNAME }
    };
    const pub = redis.createClient(6380, process.env.REDISCACHEHOSTNAME, clientOptions);
    const sub = redis.createClient(6380, process.env.REDISCACHEHOSTNAME, clientOptions);

    io.adapter(redisAdapter({ pubClient: pub, subClient: sub, key: 'socket.io' }));
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
