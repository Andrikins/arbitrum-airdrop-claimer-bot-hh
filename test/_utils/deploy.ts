import { BaseContract, Contract } from 'ethers'
import { ethers } from 'hardhat'
import { FactoryOptions } from 'hardhat/types'

export enum ContractName {
	One = 'One',
	Two = 'Two',
	ERC721A = 'ERC721A',
}

export async function deployContract(contractName: ContractName.One, args?: string[]): Promise<Contract>

export async function deployContract(contractName: ContractName.Two, args?: string[]): Promise<Contract>

export async function deployContract(contractName: ContractName.ERC721A, args?: string[]): Promise<Contract>

export async function deployContract<CT extends BaseContract>(
	contractName: ContractName,
	args?: string[]
): Promise<CT> {
	const factoryOptions: FactoryOptions = {}

	if (contractName === ContractName.One) {
		const signerVerificationLibrary = await deployContract(ContractName.Two)
		factoryOptions.libraries = {
			SignerVerification: signerVerificationLibrary.address,
		}
	}

	const Contract = await ethers.getContractFactory(contractName, factoryOptions)

	let contract: Contract
	if (args == null) {
		contract = await Contract.deploy()
	} else {
		contract = await Contract.deploy(...args)
	}

	await contract.deployed()
	return contract as CT
}
