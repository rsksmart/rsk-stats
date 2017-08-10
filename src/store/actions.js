/* eslint-disable camelcase */

/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable spaced-comment */
/* eslint-disable no-multiple-empty-lines */

export const connectionUpdate = ({ commit }, connected) => {
  commit('SOCKET_CONNECTION', (connected === true))
}
