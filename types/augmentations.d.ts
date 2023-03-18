// eslint-disable @typescript-eslint/no-explicit-any

import { TransactionResponse } from '@ethersproject/providers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { NFT, UnistoryMarketplace } from '../typechain'

// Here you can define types that will expand standard libraries' types

// Example:
declare module 'ethers' {
	export type TransactionResponseWithEvents = TransactionResponse & {
		events: any[]
	}
}

declare module 'mocha' {
	export interface Context {
		contract: UnistoryMarketplace
		nft1: NFT
		nft2: NFT
		owner: SignerWithAddress
		signers: SignerWithAddress[]
	}
}
