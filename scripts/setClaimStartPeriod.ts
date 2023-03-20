import { Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { getTestTokenDistributor } from './getTokenDistributor'

export async function setClaimPeriodStart(signer: Wallet): Promise<number> {
	const setRecipientsParams = {
		gasLimit: 500000,
		gasPrice: (await ethers.provider.getGasPrice()).mul(3).div(2),
	}

	const currentBlockNumber = await ethers.provider.getBlockNumber()
	const distributor = getTestTokenDistributor()
	await distributor.connect(signer).setClaimPeriosStart(currentBlockNumber + 3, setRecipientsParams)

	console.log('Current block number is', currentBlockNumber)
	console.log('Test claim will start at', currentBlockNumber + 3, ' block number')

	return currentBlockNumber + 3
}
