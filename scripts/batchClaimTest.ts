import { checkEligibility } from './checkEligibility'
import { getWallets } from './getSigners'
import { setClaimPeriodStart } from './setClaimStartPeriod'
import { sendTransactions } from './sendTxs'
import { Alchemy, Network } from 'alchemy-sdk'
import { showResultOfTxResponses } from './resultOfTxResponses'
import { makeSignedTransactions } from './signTxs'

const settings = {
	apiKey: '9cUljS71QQqjL_YUgMiHXtM9fo_6x_ug', // Replace with your Alchemy API KEY.
	// (not https://... or ws://, just key)
	network: Network.ETH_MAINNET,
}

const alchemy = new Alchemy(settings)

let claimStartPeriod = 16890400

async function batchClaimTest() {
	alchemy.ws.once('block', async (blockNumber) => {
		const signers = await getWallets()

		console.log('Setting claim period start ...')
		claimStartPeriod = await setClaimPeriodStart(signers[0], blockNumber)

		const eligibilityCheckResult = await checkEligibility(signers, true, true)

		const signedTxs = await makeSignedTransactions(eligibilityCheckResult.eligibleAddresses)
		console.log('All transactions are signed', signedTxs.length * 2, 'in total')

		// Wait until block number
		// let notFinished = true
		console.log('Starting to wait for the', claimStartPeriod + 1, 'block...')

		alchemy.ws.on('block', async (blockNumber) => {
			console.log(blockNumber)
			if (blockNumber >= claimStartPeriod + 1) {
				// Replace with
				// await new Promise((r) => setTimeout(r, 3000))
				const responses = await Promise.all(await sendTransactions(signedTxs))
				alchemy.ws.removeAllListeners()
				await showResultOfTxResponses(responses)
				console.log('All done!')
				process.exit(0)
			}
		})
	})
}

batchClaimTest().catch((error) => {
	console.log(error)
	alchemy.ws.removeAllListeners()
	process.exit(1)
})
