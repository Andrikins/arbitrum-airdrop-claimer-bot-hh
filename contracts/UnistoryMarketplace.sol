//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import './SwapMarketplace.sol';

contract UnistoryMarketplace is SwapMarketplaceInterface, Ownable {
	uint256 public orderIndex;

	SwapOrder[] public SwapOrders;

	/*
	 * Order events
	 */
	event OrderCreated(uint256 indexed orderId);

	event OrderClosed(uint256 indexed orderId);

	/*
	 * Proposals events
	 */
	event ProposalMade(uint256 orderId, uint256 proposalId);

	event ProposalCanceled(uint256 orderId, uint256 proposalId);

	/*
	 * Orders functions
	 */
	function createOrder(OfferItem calldata _offerItem, address _considCollection) external {
		IERC721 collection = IERC721(_offerItem.collection);

		require(msg.sender == collection.ownerOf(_offerItem.tokenId), 'You are not the owner of token');
		require(
			address(this) == collection.getApproved(_offerItem.tokenId),
			'You did`t approve token to smart contract'
		);

		SwapOrder storage newOrder = SwapOrders.push();

		newOrder.offerer = msg.sender;
		newOrder.offerItem = _offerItem;
		newOrder.considCollection = _considCollection;
		newOrder.isActive = true;

		emit OrderCreated(orderIndex);
		orderIndex++;
	}

	function cancelOrder(uint256 orderId) external {
		SwapOrder storage order = SwapOrders[orderId];

		require(msg.sender == order.offerer, 'Only creator of order can cancel it');
		require(order.isActive, 'Order is already closed');

		order.isActive = false;

		emit OrderClosed(orderId);
	}

	function execute(uint256 orderId, uint256 proposalId) external {
		SwapOrder storage order = SwapOrders[orderId];
		Proposal storage proposal = order.proposals[proposalId];

		IERC721 offeredCollection = IERC721(order.offerItem.collection);
		IERC721 considCollection = IERC721(order.considCollection);

		require(msg.sender == order.offerer, 'Only creator of order can confirm proposal');

		// Order and proposal must be active
		require(order.isActive, 'Order was canceled');
		require(proposal.isActive, 'Proposal was canceled');

		require(proposal.proposer != address(0), 'Invalid proposal');

		// Offerer and proposer still should be the owners
		require(order.offerer == offeredCollection.ownerOf(order.offerItem.tokenId), 'You are not the owner of token');
		require(proposal.proposer == considCollection.ownerOf(proposal.tokenId), 'Proposer not the owner of token');

		// Offered and proposed tokens must be apporved
		require(
			address(this) == offeredCollection.getApproved(order.offerItem.tokenId),
			'You did`t approve token for smart contract'
		);
		require(
			address(this) == considCollection.getApproved(proposal.tokenId),
			'Proposer did`t approve token for smart contract'
		);

		offeredCollection.safeTransferFrom(order.offerer, proposal.proposer, order.offerItem.tokenId);
		considCollection.safeTransferFrom(proposal.proposer, order.offerer, proposal.tokenId);

		order.isActive = false;

		emit OrderClosed(orderId);
	}

	/*
	 * Proposals functions
	 */
	function makeProposal(uint256 orderId, uint256 tokenId) external returns (uint256 proposalId) {
		SwapOrder storage order = SwapOrders[orderId];

		IERC721 collection = IERC721(order.considCollection);

		require(order.isActive, 'Order is no longer active');
		require(msg.sender == collection.ownerOf(tokenId), 'Caller is not the owner of token');
		require(address(this) == collection.getApproved(tokenId), '');

		Proposal memory newProposal = Proposal(msg.sender, tokenId, true);

		// order.proposals[order.proposalIndex] = newProposal;
		order.proposals.push(newProposal);
		// order.proposalIndex++;

		proposalId = order.proposals.length - 1;
		emit ProposalMade(orderId, proposalId);
	}

	function cancelProposal(uint256 orderId, uint256 proposalId) external returns (uint256) {
		SwapOrder storage order = SwapOrders[orderId];
		Proposal storage proposal = order.proposals[proposalId];

		require(msg.sender == proposal.proposer, 'Only creator of proposal can cancel it');

		proposal.isActive = false;

		emit ProposalCanceled(orderId, proposalId);
	}

	function getOrders() public view returns (SwapOrder[] memory) {
		SwapOrder[] memory orders = new SwapOrder[](SwapOrders.length);

		for (uint256 i = 0; i < SwapOrders.length; i++) {
			SwapOrder memory order = SwapOrders[i];
			orders[i] = order;
		}

		return orders;
	}

	function getOrderProposals(uint256 orderId) public view returns (Proposal[] memory) {
		SwapOrder storage order = SwapOrders[orderId];

		Proposal[] memory proposals = new Proposal[](order.proposals.length);

		for (uint256 i = 0; i < order.proposals.length; i++) {
			Proposal storage proposal = order.proposals[i];
			proposals[i] = proposal;
		}

		return proposals;
	}
}
