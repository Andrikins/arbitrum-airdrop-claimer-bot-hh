import { expect } from 'chai'
import { ethers } from 'hardhat'
import { createOrder } from './createOrder.test'
import { execute } from './execute.test'
import { getOrders } from './getOrders.test'
import { makeProposal } from './makeProposal.test'

describe('UnistoryMarketplace', function () {
	beforeEach(async function () {
		const Contract = await ethers.getContractFactory('UnistoryMarketplace')
		this.contract = await Contract.deploy()

		const NFTContract = await ethers.getContractFactory('NFT')
		this.nft1 = await NFTContract.deploy('NFT1', 'NFT1')
		this.nft2 = await NFTContract.deploy('NFT2', 'NFT2')

		this.signers = await ethers.getSigners()
		this.owner = this.signers[0]
	})

	it('Should be deployed', async function () {
		expect(this.contract).not.to.empty
	})

	describe('createOrder()', createOrder)
	// describe('cancelOrder()', cancelOrder)
	describe('execute()', execute)
	describe('makeProposal()', makeProposal)
	describe('getOrders()', getOrders)
	// describe('cancelProposal()', cancelProposal)
})
