const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9966 });

console.warn("WebSocket Server Started");

wss.on('connection', function connection(ws) {
  console.warn('connection!');
  ws.on('message', function incoming(message) {
    wss.clients.forEach((client) => {
      client.send(message);
    })
  });
});