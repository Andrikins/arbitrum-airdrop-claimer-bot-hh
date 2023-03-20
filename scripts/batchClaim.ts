import { TransactionRequest } from '@ethersproject/providers'
import { Wallet } from 'ethers'
import { checkEligibility } from './checkEligibility'
import { getWallets } from './getSigners'
import { getTokenDistributor } from './getTokenDistributor'
import { sendTransactions, SignedTx } from './sendTxs'

const txParams = {
	gasLimit: 500000000,
	gasPrice: 1000000000,
}

const claimPeriodStart = 16890400

async function batchClaim() {
	const dryRun = true
	// const dryRun = await yesno({ question: 'Is it dry run or check?' })
	// console.log(dryRun ? 'Tubular.' : 'Aw, why you gotta be like that?')

	const signers = await getWallets()

	await checkEligibility(signers)

	const signedTxs = await makeSignedTransactions(signers)

	// Wait until block number
	if (!dryRun) {
		const responses = await Promise.all(await sendTransactions(signedTxs))
		console.log(responses)
	}
}

async function makeSignedTransactions(signers: Wallet[]): Promise<SignedTx[]> {
	const txs = []

	for (const signer of signers) {
		const tokenDistributor = getTokenDistributor()
		const unsignedTx = await tokenDistributor.connect(signer).populateTransaction.claim(txParams)
		const signedTx = await signer.signTransaction(unsignedTx)
		txs.push(signedTx)
	}

	return txs
}

batchClaim()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error)
		process.exit(1)
	})
