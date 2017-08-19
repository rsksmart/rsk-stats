export default {
  set (key, data) {
    data = JSON.stringify(data)
    localStorage.setItem(key, data)
  },
  get (key) {
    let data = localStorage.getItem(key)
    if (data !== null) {
      return JSON.parse(data)
    }
    return null
  }
}
