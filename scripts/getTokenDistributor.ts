import { Interface } from '@ethersproject/abi'
import { Contract } from 'ethers'
import { ethers } from 'hardhat'
import TokenDistributorABI from '../TokenDistributorABI.json'
import TestTokenDistributorABI from '../TestTokenDistributorABI.json'

export function getTokenDistributor(): Contract {
	const ABI = TokenDistributorABI
	const address = getTokenDistributorAddress()
	return new Contract(address, ABI, ethers.provider)
}

export function getTestTokenDistributor(): Contract {
	const ABI = TestTokenDistributorABI
	const address = getTestTokenDistributorAddress()
	return new Contract(address, ABI, ethers.provider)
}

export function getTokenDistributorInterface(): Interface {
	const ABI = TokenDistributorABI
	return new ethers.utils.Interface(ABI)
}

export function getTokenDistributorAddress(): string {
	return '0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9'
}

export function getTestTokenDistributorAddress(): string {
	return '0x272CcF1e7C43fd881d2F80EC6d687b01a684149C'
}
