const http = require('http');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const handler = require("./srv_files/handler.js").handle;

const Analyse = {
    connnected: 0,
    total: 0
};

const server = http.createServer(handler).listen(8000, "localhost");

const io = require('socket.io')(server);

io.on('connection', function (socket) {
	Analyse.connnected++;
	Analyse.total++;
	socket.on("disconnect", ()=>{
		Analyse.connnected--;
	});
});

console.log("online at : http://localhost:8000");