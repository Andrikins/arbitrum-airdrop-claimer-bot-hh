import { expect } from 'chai'
import { shouldNotBeReverted } from '../_utils/assertion'

export const createOrder = function (): void {
	it('Should CREATE order', async function () {
		const tokenId = 0
		await this.nft1.mint()
		await this.nft1.approve(this.contract.address, tokenId)

		const considCollection = this.nft2.address

		const offerItem = {
			collection: this.nft1.address,
			tokenId,
		}

		await shouldNotBeReverted(this.contract.createOrder(offerItem, considCollection))

		const order = await this.contract.SwapOrders(0)

		expect(order.isActive).to.be.true
		expect(order.offerer).to.be.eq(this.owner.address)
		expect(order.offerer).to.be.eq(this.owner.address)
		// expect(order.offerer).to.be.true
		// expect(order.isActive).to.be.true
	})
}
