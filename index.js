const Fs = require('fs')
const Path = require('path')

module.exports = (bot, scripts) => {
  var scriptsPath = Path.resolve(__direname, 'scripts')

  Fs.exists(scriptsPath, (exists) => {
    if (exists) {
      fs.readdirSync(scriptsPath).forEach((path) => {
        if (scripts && scipts.indexOf(script) >= 0)
          robot.loadFile(scriptsPath, script)
        else
          robot.loadFile(scriptsPath, script)
      })
    }
  })
}
