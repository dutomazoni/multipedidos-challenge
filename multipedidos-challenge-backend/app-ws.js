const WebSocket = require('ws')
const dotenv = require('dotenv')
const path = require('path')
const { scaleRead } = require('./scaleRead')
const { sendData } = require('./sendData')
dotenv.config({ path: path.join(__dirname, '.env') });

function onError (ws, err) {
  console.error(`onError: ${err.message}`)
}

function onMessage (ws, data) {
  scaleRead(data, ws)
}

function onConnection (ws, req) {
  console.log(`Conectado!`)
  sendData(ws)
  ws.on('message', data => onMessage(ws, data))
  ws.on('error', error => onError(ws, error))

}

module.exports = (server) => {
  const wss = new WebSocket.Server({
    server,
  })
  wss.on('connection', onConnection)
  // console.log(`App Web Socket Server is running!`)
  return wss
}
