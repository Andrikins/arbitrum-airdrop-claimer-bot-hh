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

		const claimResponse = ethers.provider.sendTransaction(tx.signedClaim).catch((error) => {
			console.log(`${signers[index].address} | 🗙  | 🗙  | -      | ${error.message}`)
		})
		await new Promise((r) => setTimeout(r, 30))
		claimAndTransferResponse.push(claimResponse)

		const transferResponse = ethers.provider.sendTransaction(tx.signedTransfer).catch((error) => {
			// console.log('Transaction tx failed', tx, '\n', error)
		})
		await new Promise((r) => setTimeout(r, 30))
		claimAndTransferResponse.push(transferResponse)

		txsResponses.push(claimAndTransferResponse as ClaimAndTransferResponses)
	}

	return txsResponses
}
