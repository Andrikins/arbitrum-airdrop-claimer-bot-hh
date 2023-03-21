import { Overrides, Wallet } from 'ethers'
import { getTestToken } from './getToken'
import { getTestTokenDistributor } from './getTokenDistributor'
import receiversAddresses from '../inputs/receiversAddresses.json'
import settings from '../inputs/settings.json'

export interface SignedTxs {
	signedClaim: string
	signedTransfer: string
}

export async function makeSignedTransactions(signers: Wallet[]): Promise<SignedTxs[]> {
	const txs: SignedTxs[] = []

	const claimParams: Overrides = settings.claimTx
	const transferParams: Overrides = settings.transferTx

	for (const [index, signer] of signers.entries()) {
		try {
			const tokenDistributor = getTestTokenDistributor()
			const token = getTestToken()

			const nonce = await signer.getTransactionCount()
			claimParams.nonce = nonce
			transferParams.nonce = nonce + 1

			const unsignedClaimTx = await tokenDistributor.connect(signer).populateTransaction.claim(claimParams)

			const claimableAmount = await tokenDistributor.claimableTokens(signer.address)
			const unsignedTransferTx = await token
				.connect(signer)
				.populateTransaction.transfer(
					receiversAddresses[index % receiversAddresses.length],
					claimableAmount,
					transferParams
				)

			const signedTxs: SignedTxs = {
				signedClaim: await signer.signTransaction(unsignedClaimTx),
				signedTransfer: await signer.signTransaction(unsignedTransferTx),
			}

			txs.push(signedTxs)
		} catch (error) {
			// console.log(chalk.red('Unable to sign tx', signer.address))
		}
	}

	return txs
}
