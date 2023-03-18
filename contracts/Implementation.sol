// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Implementation {
	function add(uint256 a, uint256 b) public pure returns (uint256) {
		unchecked {
			return a + b;
		}
	}
}
