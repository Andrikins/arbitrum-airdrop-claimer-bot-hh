import { Contract } from 'ethers'
import { ethers } from 'hardhat'
import MultiCallABI from '../abi/MultiCallContractABI.json'

export async function getL1BlockNumberOnArbitrum(): Promise<number> {
	const ABI = MultiCallABI
	const contract = new Contract('0x842eC2c7D803033Edf55E478F461FC547Bc54EB2', ABI, ethers.provider)
	const blockNumber = (await contract.getL1BlockNumber()).toNumber()
	return blockNumber
}
