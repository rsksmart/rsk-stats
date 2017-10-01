export default function () {
  return {
    date: Date.now(),
    dateInterval: null,
    size: {
      w: 0,
      h: 0
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
