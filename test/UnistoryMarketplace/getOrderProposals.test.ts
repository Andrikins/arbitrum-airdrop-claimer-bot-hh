import { expect } from 'chai'

export const getOrderProposals = function (): void {
	const orderId = 0

	beforeEach(async function () {
		const tokenId = 0
		const considCollection = this.nft2.address

		await this.nft1.mint()
		await this.nft1.approve(this.contract.address, tokenId)

		const offerItem = {
			collection: this.nft1.address,
			tokenId,
		}

		await this.contract.createOrder(offerItem, considCollection)

		for (let i = 0; i < 10; i++) {
			await this.nft2.connect(this.signers[1]).mint()
			await this.nft2.connect(this.signers[1]).approve(this.contract.address, i)

			await this.contract.connect(this.signers[1]).makeProposal(orderId, considCollection)
		}
	})

	it('Should RETURN orders', async function () {
		const proposals = await this.contract.getOrderProposals(orderId)

		for (let i = 0; i < 10; i++) {
			expect(proposals[i].proposer).to.be.eq(this.signers[1].address)
			expect(proposals[i].tokenId).to.be.eq(i)
			expect(proposals[i].isActive).to.be.true
		}
	})
}
