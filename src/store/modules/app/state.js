export default function (types) {
  return function () {
    return {
      selection: {
        [types.NODE]: {},
        [types.LINK]: {}
      },
      dialogs: [],
      showTable: false
    }
  }
}

