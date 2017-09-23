export default function (types) {
  return function () {
    return {
      selection: {
        [types.NODE]: {},
        [types.LINK]: {}
      },
      dialogs: [],
      frontDialogId: null,
      showTable: false
    }
  }
}

