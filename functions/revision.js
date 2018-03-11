const Datastore = require('@google-cloud/datastore')

let ds = Datastore()

module.exports = (req, res) => {
  ds.get(ds.key(['Revision', 'latest']))
    .then(data => {
      if (data.length > 0) {
        res.send(`${data[0].number}`)
      } else {
        res.send('-1')
      }
    })
    .catch(err => res.send('-1'))
}