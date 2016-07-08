const Utils = require('../utils')
const DataHelper = require('../utils/data-helper')

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
    var query = res.match[1]
    var items = []

    Utils.lookup(res, query, (err, response) => {
      if (err) return console.error('Error:', err)

      items = response.map((item) => {
        return dataHelper.parseItemAttachment(item)
      })

      bot.emit('slack-attachment', {
        message: res.message,
        attachments: items
      })
    })
  })

  bot.respond(/inventory (.*)/i, (res) => {
    var playerName = res.match[1]

    Utils.getPlayerId(res, playerName, (err, playerId) => {
      if (err) return console.error('Error:', err)

      Utils.getCharacterId(res, playerId, (err, characterId) => {
        if (err) return console.error('Error:', err)

        Utils.getCharacterInventory(res, playerId, characterId, (err, response) => {
          if (err) return console.error('Error:', err)

          var items = response.map((item) => {
            return dataHelper.parseItemAttachment(item)
          })

          bot.emit('slack-attachment', {
            message: res.message,
            attachments: items
          })
        })
      })
    })
  })

  bot.respond(/vendor xur/i, (res) => {
    Utils.getXurInventory(res, (err, response) => {
      if (err || !response) return res.send('Xur is currently unavailable.')

      var itemsDefs = response.definitions.items
      var itemsCategories = response.data.saleItemCategories
      var exoticCategory = itemsCategories.filter((cat) => {
        return cat.categoryTitle === 'Exotic Gear'
      })
      var exoticData = exoticCategory[0].saleItems
      var itemsData = exoticData.map((exotic) => {
        return dataHelper.serializeFromApi(exotic.item, itemsDefs)
      })

      bot.emit('slack-attachment', {
        message: res.message,
        attachments: dataHelper.parseItemsForAttachment(itemsData)
      })
    })
  })
}
