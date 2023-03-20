import { TransactionResponse } from '@ethersproject/providers'
import chalk from 'chalk'
import { ethers } from 'hardhat'

export type SignedTx = string

export async function sendTransactions(signedTxs: SignedTx[]): Promise<Promise<TransactionResponse>[]> {
	const txsResponses = []

	for (const tx of signedTxs) {
		try {
			const response = ethers.provider.sendTransaction(tx)
			await new Promise((r) => setTimeout(r, 30))
			txsResponses.push(response)
		} catch (error) {
			console.log(chalk.red('Sending tx failed', tx))
		}
	}

	return txsResponses
}
