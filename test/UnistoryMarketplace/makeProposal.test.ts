import { expect } from 'chai'
import { shouldNotBeReverted } from '../_utils/assertion'

export const makeProposal = function (): void {
	const orderId = 0

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
	})

	it('Should MAKE proposal', async function () {
		const tokenId = 0
		await this.nft2.connect(this.signers[1]).mint()
		await this.nft2.connect(this.signers[1]).approve(this.contract.address, tokenId)

		await shouldNotBeReverted(this.contract.connect(this.signers[1]).makeProposal(orderId, tokenId))

		const proposals = await this.contract.getOrderProposals(orderId)
		const proposal = proposals[0]

		expect(proposals.length).to.be.eq(1)
		expect(proposal.proposer).to.be.eq(this.signers[1].address)
		expect(proposal.tokenId).to.be.eq(tokenId)
		expect(proposal.isActive).to.be.eq(true)
	})
}
