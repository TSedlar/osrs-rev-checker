const Socket = require('net').Socket
const struct = require('bufferpack')
const http = require('http')
const store = require('@google-cloud/storage')({ projectId: 'osrs-rev-checker' })

const OLDSCHOOL_PACK = 'http://oldschool1.runescape.com/gamepack.jar'
const REMOTE_JAR = 'http://storage.googleapis.com/osrs-jars/'

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
  },
  downloadAndStore: (rev) => {
    return new Promise((resolve, reject) => {
      let upload = store.bucket('osrs-jars').file(`${rev}.jar`)
        .createWriteStream({
          metadata: { contentType: 'application/octet-stream' }
        })
      http.get(OLDSCHOOL_PACK, (response) => {
        response.pipe(upload)
      }).on('error', (err) => reject(err))
      upload.on('finish', () => resolve(`${REMOTE_JAR}${target}`))
    })
  }
}