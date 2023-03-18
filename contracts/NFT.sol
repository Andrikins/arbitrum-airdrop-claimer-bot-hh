import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

contract NFT is ERC721 {
	uint256 counter;

	constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

	function mint() public {
		_mint(msg.sender, counter);
		counter++;
	}
}
