// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract MembershipNFT is ERC721{
    // address contractaddress;
    constructor() ERC721("Membership", "NFT2"){
       
    }

    uint private  _tokenId = 0;
    uint public tokencount=0;

    function mint(address maadress) external returns (uint) {
        _tokenId++; 
        tokencount++;
        _mint(msg.sender, _tokenId);
        // setApprovalForAll(contractaddress,true);
        // _approve(maadress, _tokenId);
        return _tokenId;
    }

}