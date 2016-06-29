const Utils = require('../utils')
const DataHelper = require('./bungie-data-helper')

var dataHelper = new DataHelper()

module.exports = (bot) => {
  dataHelper.fetchDefs()

  bot.respond(/grimoire (.*)/i, (res) => {
    var player = res.match[1]

    Utils.getPlayerId(res, player, (err, playerId) => {
      if (err) return res.send(err)

      Utils.getGrimoireScore(res, playerId, (err, score) => {
        if (err) return res.send(err)

        res.send(`${player}'s grimoire score is ${score}`)
      })
    })
  })

  bot.respond(/lookup (.*)/i, (res) => {
    var query = res.match[1], items = [], payload

    Utils.lookup(res, query, (err, response) => {
      items = response.map((item) => {
        return dataHelper.parseItemAttachment(item)
      })

      payload = {
        message: res.message,
        attachments: items
      }

      bot.emit('slack-attatchment', payload)
    })
  })
}
