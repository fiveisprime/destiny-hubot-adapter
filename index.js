const Fs = require('fs')
const Path = require('path')

module.exports = (robot, scripts) => {
  var scriptsPath = Path.resolve(__dirname, 'scripts')

  Fs.exists(scriptsPath, (exists) => {
    if (exists) {
      Fs.readdirSync(scriptsPath).forEach((script) => {
        if (scripts && scripts.indexOf(script) >= 0) {
          robot.loadFile(scriptsPath, script)
        } else {
          robot.loadFile(scriptsPath, script)
        }
      })
    }
  })
}
