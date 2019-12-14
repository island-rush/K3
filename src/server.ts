/**
 * Handles setting up and starting the server.
 * Sessions, Routing, and Web Sockets
 */

//Use Environment Variables from .env when in development
import dotenv from "dotenv";
if (process.env.NODE_ENV != "production") {
    dotenv.config();
}

//Create the server
import express, { Application, Response, Request } from "express";
import http, { Server } from "http";
const app: Application = express();
const server: Server = http.createServer(app);

//Session Setup
import session from "express-session";
const LokiStore = require("connect-loki")(session);
const lokiOptions = {};
const secret = process.env.SESSION_SECRET || "@d$f4%ggGG4_*7FGkdkjlk";
const fullSession = session({
    store: new LokiStore(lokiOptions),
    secret,
    resave: false,
    saveUninitialized: false
});
app.use(fullSession); //App has access to sessions
app.use(express.urlencoded({ extended: true })); //parses data and puts into req.body

//Server Routing
//TODO: Use middleware or reverse proxy to serve static files -> aka, anything with res.sendFile()
import router from "./server/router";
app.use("/", router);
app.use(express.static(__dirname + "/react-client/build"));
app.use((req: Request, res: Response) => {
    res.status(404).sendFile(__dirname + "/server/pages/404.html");
});

//Socket Setup
import { Socket } from "socket.io";
import sharedsession = require("express-socket.io-session");
import socketSetup from "./server/socketSetup";
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
