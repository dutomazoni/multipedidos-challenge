const WebSocket = require('ws')
const { SerialPort } = require('serialport')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(__dirname, '.env') });

// gerando um array de 10 valores aleatórios com uma variância de 1.5% para simular uma balança
function generateRandomWeightArray() {
  const length = 100;
  const variancePercentage  = 0.015; // 1.5%

  let array = [];
  let currentValue = (Math.random() * 1000)

  for (let i = 0; i < length; i++) {
    let variance = (Math.random() - 0.5) * 2 * variancePercentage;
    let value = (currentValue * (1 + variance));
    array.push(value.toFixed(2));
  }

  return array;
}

// calculando a média dos valores para ser o peso estabilizado
function calculateAverage(array) {
  const sum = array.reduce((acc, currentValue) => acc + parseFloat(currentValue), 0);
  return (sum / array.length).toFixed(2);
}

function onError (ws, err) {
  console.error(`onError: ${err.message}`)
}

function onMessage (ws, data) {
  let receivedData = JSON.parse(data)
  // configurações da balança
  let measureUnit = receivedData.measureUnit
  let baudRateScale = process.env.BAUDRATESCALE ||'9600'
  let pathScale = process.env.PATHSCALE || 'COM2'
  let priceKg = 50
  let buffet = 30
  let totalValue = 0

  // Abrindo porta da balança
  const port = new SerialPort({ path: pathScale, baudRate: parseInt(baudRateScale) })

  port.on('open', () => {
    console.log(`Balança conectada na porta ${pathScale} com baud rate de ${baudRateScale}.`)
  })

  port.on('data', (data) => {
    data = JSON.parse(data)
    console.log('Calculando peso estabilizado...')
    let currWeight = calculateAverage(data.currWeight)

    // calculando o preço do prato
    if (measureUnit === 'g') {
      totalValue = (parseFloat(currWeight)) * priceKg / 1000
    } else {
      totalValue = (parseFloat(currWeight) / 1000) * priceKg
    }

    let message = {
      value: `${totalValue >= buffet ? buffet.toFixed(2) : totalValue.toFixed(2)}`,
      mode: totalValue >= buffet ? 'Livre' : 'Kg',
      unit: measureUnit,
      firstWeight: `${measureUnit === 'g' ? parseFloat(data.currWeight[0]).toFixed(2) : (parseFloat(data.currWeight[0]) /
        1000).toFixed(2)}`,
      weight: `${measureUnit === 'g' ? parseFloat(currWeight).toFixed(2) : (parseFloat(currWeight) /
        1000).toFixed(2)}`,
    }
    ws.send(JSON.stringify(message))
    // fechando a porta depois de receber dados
    port.close((err) => {
      if (err) {
        return console.error('Error closing port:', err.message)
      }
      console.log('Scale Port closed.')
    })
  })

}

function onConnection (ws, req) {
  console.log(`Conectado!`)
  // assim que é iniciada a conexão, já começam a ser enviados dados
  // a cada 3s, simulando novos pratos sendo pesados
  let pathSend = process.env.PATHSEND || "COM3"
  let baudRateSend = process.env.BAUDRATESEND || "9600"
  // abrindo porta que envia os dados
  const portSend = new SerialPort({ path: pathSend, baudRate: parseInt(baudRateSend) })

  portSend.on('open', () => {
    console.log(`Enviando dados de ${pathSend} com baud rate de ${baudRateSend}.`)
  })

  // enviando dados para a porta da balança
  setInterval(() => {
    const dataToSend = { currWeight: generateRandomWeightArray() }
    portSend.write(JSON.stringify(dataToSend), (err) => {
      if (err) {
        return console.error('Error writing to port:', err.message)
      }
      // console.log(`Data sent: ${JSON.stringify(dataToSend)}`)
      console.log(`Data sent!`)
      ws.send(JSON.stringify(dataToSend.currWeight[0]))
    })
  }, 3000)

  ws.on('message', data => onMessage(ws, data))
  ws.on('error', error => onError(ws, error))

}

module.exports = (server) => {
  const wss = new WebSocket.Server({
    server,
  })

  wss.on('connection', onConnection)

  console.log(`App Web Socket Server is running!`)
  return wss
}
