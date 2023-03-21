import { Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { getTestTokenDistributor } from './getTokenDistributor'

export async function setClaimPeriodStart(signer: Wallet, blockNumber: number): Promise<number> {
	const blockPad = 3
	const setRecipientsParams = {
		gasLimit: 800000,
		gasPrice: (await ethers.provider.getGasPrice()).mul(3).div(2),
	}

	const distributor = getTestTokenDistributor()
	await distributor.connect(signer).setClaimPeriosStart(blockNumber + blockPad, setRecipientsParams)

	console.log('Current block number is', blockNumber)
	console.log('Test claim will start at', blockNumber + blockPad, ' block number')
	console.log('\n')

	return blockNumber + blockPad
}
