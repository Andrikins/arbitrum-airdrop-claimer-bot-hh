import * as dotenv from 'dotenv'

import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import { NetworkUserConfig } from 'hardhat/types'
import { chainIds } from './utils/constants'

dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.13',
		settings: {
			optimizer: {
				enabled: true,
				runs: 100,
			},
		},
	},
	networks: {
		// Ethereum
		mainnet: createEthereumNetworkConfig(),
		ropsten: createEthereumNetworkConfig(),
		rinkeby: createEthereumNetworkConfig(),
		kovan: createEthereumNetworkConfig(),

		// Binance Smart Chain
		'bsc-main': {
			url: '',
			accounts: getDeploymentAccount(),
		},
		'bsc-test': {
			url: '',
			accounts: getDeploymentAccount(),
		},

		// Polygon
		polygon: {
			url: 'https://ijbdprofviy6.usemoralis.com:2053/server',
			accounts: getDeploymentAccount(),
		},
		mumbai: {
			url: 'https://r8wontufnqbi.usemoralis.com:2053/server',
			accounts: getDeploymentAccount(),
		},
		hpb: {
			url: 'https://hpbnode.com',
			accounts: getDeploymentAccount(),
		},
		arbitrum: {
			url: 'https://arb1.arbitrum.io/rpc',
			accounts: getDeploymentAccount(),
		},
	},
	gasReporter: {
		enabled: true,
		coinmarketcap: 'af8ddfb6-5886-41fe-80b5-19259a3a03be',
		currency: 'ETH',
		token: 'ETH',
		gasPrice: 42.5,
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
}

export default config

function createEthereumNetworkConfig(networkName: keyof typeof chainIds = 'rinkeby'): NetworkUserConfig {
	return {
		url: 'https://' + networkName + '.infura.io/v3/' + process.env.INFURA_PROJECT_ID,
		chainId: chainIds[networkName],
		accounts: getDeploymentAccount(),
	}
}

function getDeploymentAccount(): string[] {
	return process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
}
