export default function (types) {
  return function () {
    return {
      selection: {
        [types.NODE]: {},
        [types.LINK]: {}
      },
      dialogs: [],
      frontDialogId: null,
      bigDataFields: {
        bestBlock: {
          show: true,
          minimized: false
        },
        lastBlockTime: {
          show: true,
          minimized: false
        },
        avgBlockTime: {
          show: true,
          minimized: false
        },
        lastDifficulty: {
          show: true,
          minimized: false
        },
        avgHashrate: {
          show: true,
          minimized: false
        },
        btcAvgHashrate: {
          show: false,
          minimized: false
        },
        hashrateComparedToBtcNetwork: {
          show: true,
          minimized: false
        },
        uncles: {
          show: true,
          minimized: true
        },
        gasPrice: {
          show: true,
          minimized: true
        },
        gasLimit: {
          show: true,
          minimized: true
        },
        minGasPrice: {
          show: true,
          minimized: true
        }
      },
      showTable: false
    }
  }
}
