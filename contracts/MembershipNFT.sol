// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
contract MembershipNFT is  ERC721Enumerable{
     using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;
  address public marketplace;

  struct Item {
    uint256 id;
    address creator;
    string uri;
  }
    // address contractaddress;
     mapping(uint256 => Item) public Items; 

    constructor() ERC721("Membership", "MembNFT"){}


    // uint private  _tokenId = 0;
    // uint public tokencount=0;

    function mint(string memory uri) external returns (uint) {
        _tokenIds.increment();
         uint256 newItemId = _tokenIds.current();
         _safeMint(msg.sender, newItemId);
        // _mint(msg.sender, _tokenId);
        // setApprovalForAll(marketplace,true);
        // _approve(maadress, _tokenId);
        approve(marketplace, newItemId);

        Items[newItemId] = Item({
      id: newItemId, 
      creator: msg.sender,
       uri: uri
            });
        return newItemId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
    return Items[tokenId].uri;
  }

  function setMarketplace(address market) public {
    marketplace = market;
  }

}