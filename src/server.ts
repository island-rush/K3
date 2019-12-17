/**
 * Handles setting up and starting the server.
 * Sessions, Routing, and Web Sockets
 */

import express, { Application, Request, Response } from "express";
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
let fullSession;
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

app.use(fullSession); //App has access to sessions

//parses data and puts into req.body
app.use(express.urlencoded({ extended: true }));

//Server Routing
//TODO: Use middleware or reverse proxy to serve static files -> aka, anything with res.sendFile()
app.use("/", router);
app.use(express.static(__dirname + "/react-client/build"));
app.use((req: Request, res: Response) => {
    res.status(404).sendFile(__dirname + "/server/pages/404.html");
});

//Socket Setup
const io = require("socket.io")(server);
io.use(sharedsession(fullSession)); //Socket has access to sessions
io.sockets.on("connection", (socket: Socket) => {
    socketSetup(socket);
});

//Start the server
const port = process.env.PORT || "80";
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
