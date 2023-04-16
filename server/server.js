import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 8080,
});

function heartbeat() {
  this.isAlive = true;
}

wss.on("connection", (ws) => {
  ws.isAlive = true;

  // List all clients
  wss.clients.forEach(function each(client) {
    console.log(`Client ID: ${client._socket.remoteAddress}`);
  });

  ws.on("error", console.error);

  ws.on("message", (data) => {
    console.log(ws._socket.remoteAddress);
    console.log("received: %s", data);
  });

  ws.on("close", () => {
    console.log(`Client ${ws._socket.remoteAddress} disconnected.`);
    clearInterval(interval);
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping();
    });
  }, 5000);

  ws.on("pong", heartbeat);

  ws.send("something");
});
