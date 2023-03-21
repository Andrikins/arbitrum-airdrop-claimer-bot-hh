import { TransactionResponse } from '@ethersproject/providers'
import { Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { SignedTxs } from './signTxs'

export type ClaimAndTransferResponses = [Promise<TransactionResponse>, Promise<TransactionResponse>]

export async function sendTransactions(
	signedTxs: SignedTxs[],
	signers: Wallet[]
): Promise<ClaimAndTransferResponses[]> {
	const txsResponses: ClaimAndTransferResponses[] = []

	for (const [index, tx] of signedTxs.entries()) {
		const claimAndTransferResponse = []

		const singletonErrorRector = {
			isReactedOnError: false,
			address: signers[index].address,
			logError: function (error: any, tx: string) {
				if (this.isReactedOnError) return
				this.isReactedOnError = true
				const [claim, transfer] = tx === 'claim' ? ['🗙', '🗙'] : ['✓', '🗙']
				console.log(`${this.address} | ${claim}  | ${transfer}  | -      | ${error.message.slice(0, 50)}`)
			},
		}

		const claimResponse = ethers.provider
			.sendTransaction(tx.signedClaim)
			.catch((error) => singletonErrorRector.logError(error, 'claim'))
		await new Promise((r) => setTimeout(r, 30))
		claimAndTransferResponse.push(claimResponse)

		const transferResponse = ethers.provider
			.sendTransaction(tx.signedTransfer)
			.catch((error) => singletonErrorRector.logError(error, 'transfer'))

		await new Promise((r) => setTimeout(r, 30))
		claimAndTransferResponse.push(transferResponse)

		txsResponses.push(claimAndTransferResponse as ClaimAndTransferResponses)
	}

	return txsResponses
}
