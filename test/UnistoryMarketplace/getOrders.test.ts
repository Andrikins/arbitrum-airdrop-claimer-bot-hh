import { expect } from 'chai'

export const getOrders = function (): void {
	const orderId = 0

	beforeEach(async function () {
		const considCollection = this.nft2.address

		for (let i = 0; i < 10; i++) {
			await this.nft1.mint()
			await this.nft1.approve(this.contract.address, i)

			const offerItem = {
				collection: this.nft1.address,
				tokenId: i,
			}

			await this.contract.createOrder(offerItem, considCollection)
		}
	})

	it('Should RETURN orders', async function () {
		const orders = await this.contract.getOrders()

		for (let i = 0; i < 10; i++) {
			expect(orders[i].isActive).to.be.true
			expect(orders[i].offerer).to.be.eq(this.owner.address)
			expect(orders[i].offerItem.tokenId).to.be.eq(i)
			expect(orders[i].offerItem.collection).to.be.eq(this.nft1.address)
			expect(orders[i].considCollection).to.be.eq(this.nft2.address)
		}
	})
}
