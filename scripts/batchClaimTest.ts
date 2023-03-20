import { Wallet } from 'ethers'
import { checkEligibility } from './checkEligibility'
import { getWallets } from './getSigners'
import { getTestTokenDistributor } from './getTokenDistributor'
import { setClaimPeriodStart } from './setClaimStartPeriod'
import { sendTransactions, SignedTx } from './sendTxs'
import { Alchemy, Network } from 'alchemy-sdk'
import chalk from 'chalk'
import { ethers } from 'hardhat'

const settings = {
	apiKey: 'HsB4fDSdyA3KVJP2X9tpQOSRdUNF0SVl', // Replace with your Alchemy API KEY.
	// (not https://... or ws://, just key)
	network: Network.ARB_MAINNET,
}

const alchemy = new Alchemy(settings)

let claimStartPeriod = 16890400

const txParams = {
	gasLimit: 500000000,
	gasPrice: 1000000000,
}

async function batchClaimTest() {
	const signers = await getWallets()

	console.log('Setting claim period start ...')
	claimStartPeriod = await setClaimPeriodStart(signers[0])

	await checkEligibility(signers, true, true)

	const signedTxs = await makeSignedTransactions(signers)

	// Wait until block number
	alchemy.ws.on('block', async (blockNumber) => {
		console.log(blockNumber)
		if (blockNumber >= claimStartPeriod) {
			await new Promise((r) => setTimeout(r, 700))
			const responses = await Promise.all(await sendTransactions(signedTxs))
			console.log(responses)
			alchemy.ws.removeAllListeners()
		}
	})
}

async function makeSignedTransactions(signers: Wallet[]): Promise<SignedTx[]> {
	const txs = []

	for (const signer of signers) {
		try {
			const tokenDistributor = getTestTokenDistributor()
			const unsignedTx = await tokenDistributor.connect(signer).populateTransaction.claim(txParams)
			const signedTx = await signer.signTransaction(unsignedTx)
			txs.push(signedTx)
		} catch (error) {
			console.log(chalk.red('Unable to sign tx', signer.address))
		}
	}

	return txs
}

batchClaimTest()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error)
		process.exit(1)
	})
