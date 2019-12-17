import express, { Application, Request, Response, RequestHandler } from "express";
import session from "express-session";
import http, { Server } from "http";
import { Socket } from "socket.io";
import router from "./server/router";
import socketSetup from "./server/socketSetup";
import sharedsession = require("express-socket.io-session");
import { AzureTableStoreOptions, AzureTableStoreFactory } from "connect-azuretables";
import { SessionOptions } from "http2";

//Create the server
const app: Application = express();
const server: Server = http.createServer(app);

//Session Setup (2 possible types)
let fullSession: RequestHandler;
if (process.env.SESSION_TYPE === "azure") {
    //Azure Sessions uses Azure Storage Account (tables) -> Probably best for auto-scaling with multiple instances
    const AzureTablesStoreFactory: AzureTableStoreFactory = require("connect-azuretables")(session);
    const AzureOptions: AzureTableStoreOptions = {
        sessionTimeOut: 120
    };
    fullSession = session({
        store: AzureTablesStoreFactory.create(AzureOptions),
        secret: process.env.SESSION_SECRET || "@d$f4%ggGG4_*7FGkdkjlk",
        resave: false,
        saveUninitialized: false
    });
} else {
    //LokiStore session uses session-store.db file in root directory -> Probably best for single-instance or offline development
    const LokiStore = require("connect-loki")(session);
    const lokiOptions: SessionOptions = {};
    fullSession = session({
        store: new LokiStore(lokiOptions),
        secret: process.env.SESSION_SECRET || "@d$f4%ggGG4_*7FGkdkjlk",
        resave: false,
        saveUninitialized: false
    });
}

//App has access to sessions
app.use(fullSession);

//parses data and puts into req.body
app.use(express.urlencoded({ extended: true }));

//Server Routing
app.use("/", router);

//Statically serve all frontend files
app.use(express.static(__dirname + "/react-client/build")); //TODO: Use middleware or reverse proxy to serve static files -> aka, anything with res.sendFile()

//Socket Setup
const io: SocketIO.Server = require("socket.io")(server);
io.use(sharedsession(fullSession)); //Socket has access to sessions
io.sockets.on("connection", (socket: Socket) => {
    socketSetup(socket);
});

//Start the server
const port = process.env.PORT || "80";
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
