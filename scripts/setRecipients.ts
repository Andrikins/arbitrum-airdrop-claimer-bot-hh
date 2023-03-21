import { BigNumber, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { getTestTokenDistributor } from './getTokenDistributor'

export async function setRecipients(signers: Wallet[]): Promise<void> {
	const distributor = getTestTokenDistributor()
	const addresses = signers.map((rec) => rec.address)
	const amounts = new Array(signers.length).fill(Math.ceil(Math.random() * 10000))
	const amountsBigNumber = amounts.map((amount) => BigNumber.from(amount).mul('1000000000000000000'))

	const txParams = {
		gasLimit: 487000 + signers.length * 700000,
		gasPrice: await ethers.provider.getGasPrice(),
	}

	for (let i = 0; i < signers.length; i += 25) {
		const addressesPart = addresses.slice(i, i + 25 - 1)
		const amountsPart = amountsBigNumber.slice(i, i + 25 - 1)
		await distributor.connect(signers[1]).setRecipients(addressesPart, amountsPart, txParams)
	}
}
