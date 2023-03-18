// SPDX-License-Identifier: MIT

struct SwapOrder {
	address offerer;
	OfferItem offerItem;
	address considCollection;
	bool isActive;
	// uint256 proposalIndex;
	Proposal[] proposals;
}

struct OfferItem {
	address collection;
	uint256 tokenId;
}

struct Proposal {
	address proposer;
	uint256 tokenId;
	bool isActive;
}

interface SwapMarketplaceInterface {
	/*
	 * Orders functions
	 */
	function createOrder(OfferItem calldata offer, address considCollection) external;

	function cancelOrder(uint256 orderId) external;

	function execute(uint256 orderId, uint256 proposalId) external;

	/*
	 * Proposals functions
	 */
	function makeProposal(uint256 orderId, uint256 tokenId) external returns (uint256 proposalId);

	function cancelProposal(uint256 orderId, uint256 proposalId) external returns (uint256);
}
