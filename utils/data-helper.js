const Util = require('util')

const Request = require('request')

var DataHelper = module.exports = () => {}

DataHelper.prototype.fetchDefs = function() {
  this.fetchStatDefs((err, response, body) => {
    this.statDefs = body
  })
  this.fetchVendorDefs((err, response, body) => {
    this.vendorDefs = body
  })
}

DataHelper.prototype.serializeFromApi = function(item, defs) {
  var rarityColor = {
    Uncommon: '#f5f5f5'
    Common: '#2f6b3c'
    Rare: '#557f9e'
    Legendary: '#4e3263'
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
    iconLink: prefix + iconSuffix,
    itemLink: prefix + itemSuffix,
    primaryStat: item.primaryStat,
    stats: item.stats
  }
};
