import WebSocket, { WebSocketServer } from "ws";
import moment from "moment";

const wss = new WebSocketServer({
  port: 8080,
});

const heartbeat = (ws) => {
  ws.isAlive = true;
};

let clientList = [];

wss.on("connection", (ws) => {
  console.log("Connected: " + ws._socket.remoteAddress);
  ws.isAlive = true;
  ws.on("pong", () => {
    heartbeat(ws);
  });
  ws.on("error", console.error);
  ws.on("close", () => {
    console.log("Closed: " + ws._socket.remoteAddress);
    // Filters out the client with a client ID similar to the closed connection's remote address
    clientList = clientList?.filter((client) => {
      return client?.id !== ws._socket.remoteAddress;
    });
  });

  ws.on("message", (data) => {
    try {
      let parsedData = JSON.parse(String(data).replace(/'/g, '"'));
      parsedData = {
        ...parsedData,
        data: { ...parsedData?.data, id: ws._socket.remoteAddress },
      };

      if (parsedData.type === "register") {
        if (
          !clientList?.find((client) => client?.id === parsedData?.data?.id)
        ) {
          if (parsedData.data.type === "arduino") {
            clientList.push({
              type: parsedData.data.type,
              id: String(ws._socket.remoteAddress),
              clientId: parsedData.data.clientId,
              client: ws,
              name: parsedData.data.name,
              sensorValue: parsedData.data.sensorValue,
              dateTime: moment().format("MMMM Do YYYY, h:mm:ss a").toString(),
            });
          } else {
            clientList.push({
              type: parsedData.data.type,
              id: String(ws._socket.remoteAddress),
              clientId: parsedData.data.clientId,
              client: ws,
              name: parsedData.data.name,
            });
          }
        }
      } else if (parsedData.type === "message") {
        if (parsedData.data.type === "arduino") {
          clientList = clientList.map((client) => {
            if (client.id === parsedData.data.id) {
              return {
                ...client,
                sensorValue: parsedData.data.sensorValue,
                dateTime: moment().format("MMMM Do YYYY, h:mm:ss a").toString(),
              };
            }
            return client;
          });
        } else {
        }
      }
    } catch (error) {
      console.error(error);
      return;
    }
  });
});

const adminUpdateInterval = setInterval(() => {
  const admin = clientList?.filter((client) => client.type === "admin");
  admin?.forEach((admin) =>
    admin.client.send(
      JSON.stringify(clientList.filter((client) => client.type === "arduino"))
    )
  );
}, 1000);

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
  const clientAddressList = Array.from(wss.clients).map((client) => {
    return client._socket.remoteAddress;
  });
  console.log(
    Array.from(wss.clients)?.map((client) => {
      return client._socket.remoteAddress;
    })
  );
  // Checks if each client within the clientList is a websocket client.
  clientList = clientList.filter((client) => {
    return clientAddressList.some((address) => address === client.id);
  });
  // Checks if
}, 5000);

wss.on("close", () => {
  clearInterval(interval);
  clearInterval(adminUpdateInterval);
});
