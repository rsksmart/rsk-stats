export default function () {
  return {
    APP: process.env.APP,
    date: Date.now(),
    dateInterval: null,
    size: {
      w: 0,
      h: 0
    },
    cols: {
      a: {
        w: 0,
        h: 0
      },
      c: {
        w: 0,
        h: 0
      }
    },
    socketConnected: false,
    activeSnapshot: null,
    snapshotImport: {
      error: null,
      name: null
    },
    appPrevState: null,
    backendData: {},
    snapshots: {},
    config: {}
  }
}
