export const DOMAIN_TESTNET = process.env.VUE_APP_DOMAIN_TESTNET
export const DOMAIN_MAINNET = process.env.VUE_APP_DOMAIN_MAINNET
export const NETWORK = process.env.WS_URL

export const isNetworkmainnet = !NETWORK.includes('testnet')
