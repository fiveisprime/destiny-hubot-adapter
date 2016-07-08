const Request = require('request')

module.exports = class DataHelper {
  fetchStatDefs (done) {
    Request({
      method: 'GET',
      url: 'http://destiny.plumbing/raw/mobileWorldContent/en/DestinyStatDefinition.json',
      gzip: true,
      json: true
    }, done)
  }

  fetchVendorDefs (done) {
    Request({
      method: 'GET',
      url: 'http://destiny.plumbing/raw/mobileWorldContent/en/DestinyStatDefinition.json',
      gzip: true,
      json: true
    }, done)
  }

  fetchDefs () {
    this.fetchStatDefs((err, response, body) => {
      if (err) return console.error('Error:', err)
      this.statDefs = body
    })
    this.fetchVendorDefs((err, response, body) => {
      if (err) return console.error('Error:', err)
      this.vendorDefs = body
    })
  }

  serializeFromApi (item, defs) {
    var rarityColor = {
      Uncommon: '#f5f5f5',
      Common: '#2f6b3c',
      Rare: '#557f9e',
      Legendary: '#4e3263',
      Exotic: '#ceae32'
    }

    var hash = item.itemHash
    var defData = defs[hash]

    var prefix = 'http://www.bungie.net'
    var iconSuffix = defData.icon
    var itemSuffix = `/en/Armory/Detail?item=${hash}`

    return {
      itemName: defData.itemName,
      itemDescription: defData.itemDescription,
      itemTypeName: defData.itemTypeName,
      rarity: defData.tierTypeName,
      color: rarityColor[defData.tierTypeName],
      iconLink: `${prefix}${iconSuffix}`,
      itemLink: `${prefix}${itemSuffix}`,
      primaryStat: item.primaryStat,
      stats: item.stats
    }
  }

  parseItemsForAttachment (items) {
    return items.map((item) => {
      return this.parseItemAttachment(item)
    })
  }

  parseItemAttachment (item) {
    var hasStats = item.stats
    var statFields = hasStats ? this.buildStats(item.stats, item.primaryStat) : []

    return {
      fallback: item.itemDescription,
      title: item.itemName,
      title_link: item.itemLink,
      color: item.color,
      text: item.itemDescription,
      thumb_url: item.iconLink,
      fields: statFields
    }
  }

  buildStats (statsData, primaryData) {
    var defs = this.statDefs
    var primaryStat

    var foundStats = statsData.map((stat) => {
      var found = defs[stat.statHash]

      if (!found) return

      return {
        title: found.statName,
        value: stat.value,
        short: true
      }
    })

    var primaryFound = primaryData && defs[primaryData.statHash]

    if (primaryFound) {
      primaryStat = {
        title: primaryFound.statName,
        value: primaryData.value,
        short: false
      }

      foundStats.unshift(primaryStat)
    }

    return foundStats.filter((x) => {
      return x
    })
  }
}
