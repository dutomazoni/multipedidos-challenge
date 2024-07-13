import { SerialPort } from 'serialport'
import { generateRandomWeightArray } from './generateRandonWeightArray'

function sendData(ws) {
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
      ws.send(JSON.stringify(dataToSend))
    })
  }, 3000)
}

export {sendData}
