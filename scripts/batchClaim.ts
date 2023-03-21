import { checkEligibility } from './checkEligibility'
import { getWallets } from './getSigners'
import { setClaimPeriodStart } from './setClaimStartPeriod'
import { sendTransactions } from './sendTxs'
import { Alchemy, Network } from 'alchemy-sdk'
import { showResultOfTxResponses } from './resultOfTxResponses'
import { makeSignedTransactions, SignedTxs } from './signTxs'
import { getL1BlockNumberOnArbitrum } from './getBlock'
import { Wallet } from 'ethers'
// import logUpdate from 'log-update'

// const ethSettings = {
// 	apiKey: '9cUljS71QQqjL_YUgMiHXtM9fo_6x_ug', // Replace with your Alchemy API KEY.
// 	// (not https://... or ws://, just key)
// 	network: Network.ETH_MAINNET,
// }

const arbSettings = {
	apiKey: 'HsB4fDSdyA3KVJP2X9tpQOSRdUNF0SVl', // Replace with your Alchemy API KEY.
	// (not https://... or ws://, just key)
	network: Network.ARB_MAINNET,
}

// const alchemyEth = new Alchemy(ethSettings)
const alchemyArb = new Alchemy(arbSettings)

let claimStartPeriod = 16890400

async function batchClaimTest() {
	// const logUpdate = (...args: any[]) => import('log-update').then(({ default: logUpdate }) => logUpdate(...args))

	const blockNumber = await getL1BlockNumberOnArbitrum()
	console.log('Start block', blockNumber)

	const signers = await getWallets()

	console.log('\nSetting claim period start ...')

	claimStartPeriod = await setClaimPeriodStart(signers[0], blockNumber)

	const eligibilityCheckResult = await checkEligibility(signers, true, true)

	const signedTxs = await makeSignedTransactions(eligibilityCheckResult.eligibleAddresses)
	console.log('All transactions are signed', signedTxs.length * 2, 'in total')

	// Wait until block number
	// let notFinished = true
	console.log('Starting to wait for the', claimStartPeriod, 'block...')
	console.log('\n')

	alchemyArb.ws.on('block', async (blockNumber) => {
		const blockNumberL1onArb = await getL1BlockNumberOnArbitrum()

		if (!SendingStartSingleton.isStartedSending) {
			clearLastLine()
			console.log('Arbitrum block', blockNumber, 'eth block in arb', blockNumberL1onArb)
		}

		if (blockNumberL1onArb >= claimStartPeriod) {
			alchemyArb.ws.removeAllListeners()
			// console.log('Ethereum target block reached')
			SendingStartSingleton.onBlockNumberConditionMet(signedTxs, eligibilityCheckResult.eligibleAddresses)
			// await new Promise((r) => setTimeout(r, 1000))
		}
	})
}

const SendingStartSingleton = {
	isStartedSending: false,
	onBlockNumberConditionMet: async function (signedTxs: SignedTxs[], signers: Wallet[]) {
		if (this.isStartedSending) {
			return
		}

		this.isStartedSending = true
		console.log("\n\nLet's go!!!")

		// Replace with
		const responses = await sendTransactions(signedTxs, signers)
		await showResultOfTxResponses(responses)
		console.log('\nAll done!')
		process.exit(0)
	},
}

batchClaimTest().catch((error) => {
	console.log(error)
	alchemyArb.ws.removeAllListeners()
	process.exit(1)
})

const clearLastLine = () => {
	process.stdout.moveCursor(0, -1) // up one line
	process.stdout.clearLine(1) // from cursor to end
}
