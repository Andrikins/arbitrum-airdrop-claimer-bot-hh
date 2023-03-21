import { TransactionResponse } from '@ethersproject/providers'
import { ethers } from 'hardhat'
import { SignedTxs } from './signTxs'

export type ClaimAndTransferResponses = [Promise<TransactionResponse>, Promise<TransactionResponse>]

export async function sendTransactions(signedTxs: SignedTxs[]): Promise<ClaimAndTransferResponses[]> {
	const txsResponses: ClaimAndTransferResponses[] = []

	for (const tx of signedTxs) {
		const claimAndTransferResponse = []

		try {
			const response = ethers.provider.sendTransaction(tx.signedClaim)
			await new Promise((r) => setTimeout(r, 30))
			claimAndTransferResponse.push(response)
		} catch (error) {
			console.log('Claim tx failed', tx)
			continue
		}

		try {
			const response = ethers.provider.sendTransaction(tx.signedTransfer)
			await new Promise((r) => setTimeout(r, 30))
			claimAndTransferResponse.push(response)
		} catch (error) {
			console.log('Transfer tx failed', tx)
		}

		txsResponses.push(claimAndTransferResponse as ClaimAndTransferResponses)
	}

	return txsResponses
}
