const osrs = require('../scripts/osrs')
const Datastore = require('@google-cloud/datastore')

let ds = Datastore()

// TODO: change this to also use the datastore
const subscribers = [
]

let connect = (url) => {
  let splits = url.split(':')
  return new Socket().connect(splits[1], splits[0])
}

let sendUpdate = (sub, rev) => {
  return new Promise((resolve, reject) => {
    let sock = connect(sub)
    sock.write(new Buffer([rev]))
    sock.end()
    resolve()
  })
}

module.exports = (event, callback) => {
  ds.get(ds.key(['Revision', 'latest']))
    .then(data => {
      let rev = 165
      if (data.length > 0) {
        rev = data[0].number
      }
      osrs.checkRevision()
        .then(current => {
          if (current > rev) {
            console.log(`revision change: ${rev} -> ${current}`)
            let promises = []
            for (let sub of subscribers) {
              promises.push(sendUpdate(sub, current))
            }
            ds.save({
              key: ds.key(['Revision', 'latest']),
              data: { number: current }
            }).then(() => {
              Promise.all(promises)
                .then(() => callback(null, current))
                .catch(err => callback(err))
            }).catch(err => callback(err))
          }
        })
        .catch(err => callback(err))
    })
    .catch(err => callback(err))
}