const defaultConfig = () => {
  return {
    showNodeInfo: true,
    netOptions: {
      force: 2500,
      nodeSize: 100,
      size: {
        w: 500, h: 500
      },
      offset: { x: 0, y: 0 },
      fontSize: 12,
      linkWidth: 2,
      nodeLabels: true,
      strLinks: true,
      canvas: false,
      resizeListener: false
    }
  }
}

export default defaultConfig
