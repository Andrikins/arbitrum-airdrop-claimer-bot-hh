import { Wallet } from 'ethers'
import { ethers } from 'hardhat'
import * as pks from '../inputs/pks.json'

export async function getWallets(): Promise<Wallet[]> {
	// const pks = await getPrivateKeys()
	console.log('Total private keys', (pks as any).default.length)

	const pksArray = []
	for (const i in pks) {
		if (typeof pks[i] !== 'string') {
			continue
		}

		pksArray.push(pks[i])
	}

	const signers = getSigners(pksArray)

	console.log('Total Wallets', signers.length, '\n')
	return signers
}

// async function getPrivateKeys(): Promise<string[]> {
// 	const pks = (await import('../pks.json')) as string[]
// 	return pks
// }

function getSigners(pks: string[]): Wallet[] {
	const signers = []

	for (const pk of pks) {
		try {
			signers.push(new Wallet(pk, ethers.provider))
		} catch (error) {
			console.log(error)
		}
	}

	return signers
}
