import * as dotenv from 'dotenv'

import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

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
		arbitrum: {
			url: 'https://arb1.arbitrum.io/rpc',
			accounts: getDeploymentAccount(),
		},
	},
}

export default config

function getDeploymentAccount(): string[] {
	return process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
}
