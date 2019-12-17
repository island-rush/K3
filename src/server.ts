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

//Create the server
const app: Application = express();
const server: Server = http.createServer(app);

//Session Setup
const LokiStore = require("connect-loki")(session);
const lokiOptions = {};
const secret = process.env.SESSION_SECRET || "@d$f4%ggGG4_*7FGkdkjlk";
const fullSession = session({
    store: new LokiStore(lokiOptions),
    secret,
    resave: false,
    saveUninitialized: false
});

// Session Setup (ALTERNATE AZURE SESSIONS) (use AZURE_STORAGE_CONNECTION_STRING in env to configure)
// const AzureTablesStoreFactory: AzureTableStoreFactory = require("connect-azuretables")(session);
// const azureOptions: AzureTableStoreOptions = {
//     sessionTimeOut: 120
// };
// const fullSession = session({
//     store: AzureTablesStoreFactory.create(azureOptions),
//     secret: "sdlfkj",
//     resave: false,
//     saveUninitialized: false
// });

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
