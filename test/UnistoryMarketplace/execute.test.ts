import { expect } from 'chai'
import { shouldNotBeReverted } from '../_utils/assertion'

export const execute = function (): void {
	const orderId = 0
	let proposals
	let proposal: any

	beforeEach(async function () {
		const tokenId = 0
		await this.nft1.mint()
		await this.nft1.approve(this.contract.address, tokenId)

		const considCollection = this.nft2.address

		const offerItem = {
			collection: this.nft1.address,
			tokenId,
		}

		await this.contract.createOrder(offerItem, considCollection)

		await this.nft2.connect(this.signers[1]).mint()
		await this.nft2.connect(this.signers[1]).approve(this.contract.address, tokenId)

		await shouldNotBeReverted(this.contract.connect(this.signers[1]).makeProposal(orderId, tokenId))

		proposals = await this.contract.getOrderProposals(orderId)
		proposal = proposals[0]
	})

	it('Should EXECUTE order', async function () {
		await shouldNotBeReverted(this.contract.execute(orderId, 0))

		expect(await this.nft1.balanceOf(this.owner.address)).to.be.eq(0)
		expect(await this.nft1.balanceOf(this.signers[1].address)).to.be.eq(1)

		expect(await this.nft2.balanceOf(this.owner.address)).to.be.eq(1)
		expect(await this.nft2.balanceOf(this.signers[1].address)).to.be.eq(0)

		const order = await this.contract.SwapOrders(0)
		expect(order.isActive).to.be.false
	})
}
