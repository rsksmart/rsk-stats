var pkg = require('../package.json')
module.exports = {
  NODE_ENV: '"production"',
  WS_URL: '"ws://stats.rsk.co"',
  APP: {
    name: JSON.stringify(pkg.name),
    version: JSON.stringify(pkg.version),
  }
}
