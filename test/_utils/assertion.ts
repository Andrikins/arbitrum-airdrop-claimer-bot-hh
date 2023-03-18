import { expect } from 'chai'
import { ContractTransaction } from 'ethers'

// Assertion Utilities

export async function shouldBeRevertedWithError(tx: Promise<ContractTransaction>, errorMsg: string): Promise<void> {
	await expect(tx).to.be.revertedWith(errorMsg)
}

export async function shouldBeReverted(tx: Promise<ContractTransaction>): Promise<void> {
	await expect(tx).to.be.reverted
}

export async function shouldNotBeReverted(tx: Promise<ContractTransaction>): Promise<void> {
	await expect(tx).not.to.be.reverted
}
