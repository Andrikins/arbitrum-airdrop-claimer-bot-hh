import { Overrides, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { getTestToken } from './getToken'
import { getTestTokenDistributor } from './getTokenDistributor'

export interface SignedTxs {
	signedClaim: string
	signedTransfer: string
}

export async function makeSignedTransactions(signers: Wallet[]): Promise<SignedTxs[]> {
	const txs: SignedTxs[] = []

	const gasPrice = await ethers.provider.getGasPrice()

	const claimParams: Overrides = {
		gasLimit: 600000,
		gasPrice: gasPrice.mul(3).div(2),
	}

	const transferParams: Overrides = {
		gasLimit: 400000,
		gasPrice: gasPrice.mul(3).div(2),
	}

	for (const signer of signers) {
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
					'0x3609b35A60A754Ca244A9d2EDB5aC885763E42be',
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
