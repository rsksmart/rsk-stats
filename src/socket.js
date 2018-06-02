var Primus = require('primus')
var socket = Primus.connect(process.env.WS_URL)
export default socket
