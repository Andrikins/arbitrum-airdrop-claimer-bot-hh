import { checkEligibility } from './checkEligibility'
import { getWallets } from './getSigners'
import { setClaimPeriodStart } from './setClaimStartPeriod'
import { sendTransactions } from './sendTxs'
import { Alchemy, Network } from 'alchemy-sdk'
import { showResultOfTxResponses } from './resultOfTxResponses'
import { makeSignedTransactions, SignedTxs } from './signTxs'
import { getL1BlockNumberOnArbitrum } from './getBlock'
import { Wallet } from 'ethers'
import settings from '../inputs/settings.json'

const arbSettings = {
	apiKey: settings.apiKey,
	network: Network.ARB_MAINNET,
}

const alchemyArb = new Alchemy(arbSettings)

let claimStartPeriod = settings.claimStartPeriod
const isTest = settings.isTest

async function batchClaimTest() {
	const warning = isTest ? 'This IS A TEST run' : 'This is NOT A TEST run'
	console.log('\n', warning, '\n')

	const blockNumber = await getL1BlockNumberOnArbitrum()
	console.log('Start block', blockNumber)

	const signers = await getWallets()

	if (isTest) {
		console.log('\nSetting claim period start ...')

		claimStartPeriod = await setClaimPeriodStart(signers[0], blockNumber)
	}

	const eligibilityCheckResult = await checkEligibility(signers, true, isTest)

	const signedTxs = await makeSignedTransactions(eligibilityCheckResult.eligibleAddresses, isTest)
	console.log(signedTxs)
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
