
const pkg = require('./package.json')
module.exports = {
  configureWebpack: {
    externals: { primus: 'Primus' }
  },
  chainWebpack: config => {
    config
      .plugin('define')
      .tap(args => {
        const WS_URL = process.env.WS_URL || 'wss://backend.stats.rsk.co'
        args[0]['process.env'] = Object.assign(args[0]['process.env'], {
          WS_URL: JSON.stringify(WS_URL),
          APP: {
            name: JSON.stringify(pkg.name),
            version: JSON.stringify(pkg.version)
          }
        })
        return args
      })
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .resourceQuery(/raw/)
      .use('vue-svg-loader')
      .loader('raw-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  }
}
