export default function (socket) {
  return store => {
    socket.on('data', (data) => {
      let action = 'backend/socket_' + data.action.replace('-', '_')
      if (store._actions[action]) {
        store.dispatch(action, data.data)
      }
    })

    socket.on('init', (data) => {
      store.dispatch('backend/socket_INIT', data)
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
