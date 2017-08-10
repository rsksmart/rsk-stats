var Primus = require('primus')
var socket = Primus.connect(process.env.WS_URL)
/* socket.id(function getID (id) {
  //
  // The primus.id method sends a packet over the connection requesting the current `id` of the active
  // connection.
  //
  console.log(id)
}) */

export default socket
