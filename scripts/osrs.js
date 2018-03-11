const Socket = require('net').Socket
const struct = require('bufferpack')

/**
* A function that gets the latest revision number of OSRS
*/
module.exports = {
  checkRevision: (latest) => {
    return new Promise((resolve, reject) => {
      let rev = latest || 165

      let options = {
        host: 'oldschool1.runescape.com',
        port: 43594
      }

      let current = rev

      let readPacket = (sock, buff) => {
        let match = (buff.readInt8(0) == 0)
        if (match) {
          resolve(current)
        } else {
          changed = true
          current++
          writePacket()
        }
        sock.destroy()
      }

      let writePacket = () => {
        let sock = new Socket().connect(options)
        sock.write(struct.pack('>bi', [15, current]))
        sock.on('data', (buff) => readPacket(sock, buff))
        sock.on('error', (err) => reject(err))
      }

      writePacket()
    })
  }
}