import { Interface } from '@ethersproject/abi'
import { Contract } from 'ethers'
import { ethers } from 'hardhat'
import TokenABI from '../abi/TokenABI.json'

export function getToken(): Contract {
	const ABI = TokenABI
	const address = getTokenAddress()
	return new Contract(address, ABI, ethers.provider)
}

export function getTestToken(): Contract {
	const ABI = TokenABI
	const address = getTestTokenAddress()
	return new Contract(address, ABI, ethers.provider)
}

export function getTokenInterface(): Interface {
	const ABI = TokenABI
	return new ethers.utils.Interface(ABI)
}

export function getTokenAddress(): string {
	return '0x912CE59144191C1204E64559FE8253a0e49E6548'
}

export function getTestTokenAddress(): string {
	return '0xB5145a1BcC3Bcd19F43e1B7f79033eEFAee8b555'
}
