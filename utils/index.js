const DataHelper = require('./data-helper')

const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY
const BASE_URL = 'https://www.bungie.net/Platform/Destiny/'

var dataHelper = new DataHelper()

var makeRequest = (bot, endpoint, params, done) => {
  var qs = '', url = ''

  if (typeof params === 'function') {
    done = params
    params = null
  }

  if (params) {
    qs += '?'

    qs += Object.keys(params).map((key) => {
      return `${key}=${params[key]}`
    }).join('&')
  }

  url = BASE_URL + endpoint + '/' + qs

  console.log('Requesting %s', url)

  bot.http(url)
    .header('X-API-KEY', BUNGIE_API_KEY)
    .get()((err, response, body) => {
      done(err, JSON.parse(body).Response)
    })
}

exports.getPlayerId = (bot, name, done) => {
  var endpoint = `SearchDestinyPlayer/2/${name}`

  makeRequest(bot, endpoint, (err, response) => {
    if (err) return done(err)

    var data = response[0]

    if (!data) {
      return done(`Guardian "${name}" not found.`)
    }

    done(null, data.membershipId)
  })
}

exports.getCharacterId = (bot, playerId, done) => {
  makeRequest(bot, `2/Account/${playerId}`, (err, response) => {
    if (err) return done(err)

    var data = response.data
    var chars = data.characters
    var recentChar = chars[0]

    return done(null, recentChar.characterBase.characterId)
  })
}

exports.lookup = (bot, query, done) => {
  var endpoint = 'Explorer/Items'
  var params = { definitions: true, name: query.trim() }
  var items = []

  makeRequest(bot, endpoint, params, (err, response) => {
    if (err) return done(err)

    items = response.data.itemHashes.map((item, index) => {
      if (index <= 2) {
        return dataHelper.serializeFromApi({ itemHash: item }, response.definitions.items)
      }
    })

    done(null, items)
  })
}

exports.getGrimoireScore = (bot, playerId, done) => {
  var endpoint = `/Vanguard/Grimoire/2/${playerId}`

  makeRequest(bot, endpoint, (err, response) => {
    done(err, response.data.score)
  })
}

exports.getXurInventory = (bot, done) => {
  var endpoint = 'Advisors/Xur'
  var params = { definitions: true }

  makeRequest(bot, endpoint, params, done)
}

exports.getCharacterInventory = (bot, playerId, characterId, done) => {
  var endpoint = `2/Account/${playerId}/Character/${characterId}/Inventory`
  var params = { definitions: true }

  makeRequest(bot, endpoint, params, (err, response) => {
    var definitions = response.definitions.items
    var equippable = response.data.buckets.Equippable
    var itemsData, items, ref

    var validItems = equippable.map((x) => {
      return x.items.filter((item) => {
        return item.isEquipped && item.primaryStat
      })
    })

    itemsData = (ref = []).concat.apply(ref, validItems);

    items = itemsData.map((item) => {
      return dataHelper.serializeFromApi(item, definitions)
    })

    done(null, items)
  })
}
