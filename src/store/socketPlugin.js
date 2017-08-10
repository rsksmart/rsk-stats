export default function (socket) {
  return store => {
    socket.on('data', (data) => {
      let action = 'socket_' + data.action.replace('-', '_')
      if (store._actions[action]) {
        store.dispatch(action, data.data)
      } else {
        console.info('Unknown action received: ' + action)
      }
    })

    socket.on('init', (data) => {
      store.dispatch('socket_INIT', data)
    })

    socket.on('open', () => {
      socket.emit('ready')
      store.dispatch('connectionUpdate', !socket.disconnect)
    })

    socket.on('disconnect', () => {
      store.dispatch('connectionUpdate', socket.disconnect)
    })

    // emits from client
    store.subscribe((mutation) => {
      if (mutation.type === 'SOCKET_EMIT' && mutation.payload.event) {
        socket.emit(mutation.payload.event, mutation.payload.data)
      }
    })
  }
}

