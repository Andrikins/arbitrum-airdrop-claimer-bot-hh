import { Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { getTestTokenDistributor } from './getTokenDistributor'

export async function setRecipients(signers: Wallet[]): Promise<void> {
	const distributor = getTestTokenDistributor()
	const addresses = signers.map((rec) => rec.address)
	const amounts = new Array(signers.length).fill(Math.ceil(Math.random() * 10000))

	const txParams = {
		gasLimit: 2000000,
		gasPrice: (await ethers.provider.getGasPrice()).mul(3).div(2),
	}

	await distributor.connect(signers[1]).setRecipients(addresses, amounts, txParams)
}
