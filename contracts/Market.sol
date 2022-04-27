// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./MembershipNFT.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract Market {
	using Counters for Counters.Counter;
	Counters.Counter private _ItemIds;
	Counters.Counter private _ItemsSold;
	MembershipNFT private token;
	address payable owner;


	struct Listing {
		uint256 id;
		uint256 tokenId;
		address payable seller; 
 //address to token contract
		uint256 price;
		bool isSold;
	}

	event ListedForSale(
		uint256 indexed id,
		uint256  indexed tokenId,
		uint256 price
	);

	event Sale(
		uint256 id,
		uint256 tokenId,
		address buyer,
		uint256 price
	);

	// event Cancel(
	// 	uint256 id,
	// 	address seller
	// );


uint public Itemscount;
	// uint private _listingId = 0;
	// Listing[] public listingobj;
	mapping(uint256 => bool) public activeItems;
	mapping(uint256 => Listing) public idtolistings;

	constructor(MembershipNFT _token) {
      token = _token;
	  owner= payable(msg.sender);
  }

 modifier checkMembership(address ad1){
	 
	//  require(token.name().toString() =="Membership","You don't have membership, Mint one Nft token and try again.");
    require(token.balanceOf(ad1) >=1, "You don't have membership, Mint one Nft token and try again.");
    _;
  }
 modifier OnlyItemOwner(uint256 tokenId){
    require(token.ownerOf(tokenId) == msg.sender, "Sender does not own the item");
    _;
  }

   modifier HasTransferApproval(uint256 tokenId){
    require(token.getApproved(tokenId) == address(this), "Market is not approved");
    _;
  }

    modifier ItemExists(uint256 id){
    require(id <= _ItemIds.current() && idtolistings[id].id == id, "Could not find item");
    _;
  }

   modifier IsForSale(uint256 id){
    require(!idtolistings[id].isSold, "Item is already sold");
    _;
  }

	function listToken(uint256 tokenId, uint256 price) 
	checkMembership(msg.sender)
	OnlyItemOwner(tokenId)
	 
    HasTransferApproval(tokenId) external  returns (uint256) {
		// require(IERC721(token).ownerOf(tokenId) ==msg.sender, "First buy Membership");
		// IERC721(token).transferFrom(msg.sender, address(this), tokenId);
		require(!activeItems[tokenId], "Item is already up for sale");

		_ItemIds.increment();
		Itemscount +=1;
		uint256 itemId= _ItemIds.current();

		idtolistings[itemId]= Listing(
			itemId,
			tokenId,
			payable(msg.sender),
 //no one is the owner currenlty
			price,
			false
		);
		 activeItems[tokenId] = true;

      assert(idtolistings[itemId].id == itemId);
	//   token.approve(address(this), tokenId);
	//   token.transferFrom(msg.sender,address(this),tokenId);

		// uint256 newItemId = listingobj.length;
	// 	listingobj.push(Listing({
    //     id: newItemId,
    //     tokenId: tokenId,
    //     seller: payable(msg.sender),
    //     price: price,
        
    //   }));
		// Listing memory listing = Listing(
		// 	ListingStatus.Active,
		// 	msg.sender, //seller(current address)
		// 	token,
		// 	tokenId,
		// 	price
		// );

		// _listingId++;
		// itemcount++;

		// _listings[_listingId] = listing;

		emit ListedForSale(
			itemId,tokenId,
			price
		);
		 return itemId;
	}

// modifier member(){
// 		// require(IERC721(token).ownerOf(tokenId) ==msg.sender, "First buy Membership");
// 	}
	

    
	function buyToken(uint id) ItemExists(id)
	checkMembership(msg.sender)
    IsForSale(id)
    HasTransferApproval(idtolistings[id].tokenId) external payable {

	require(msg.value >= idtolistings[id].price, "Not enough funds sent");
      require(msg.sender != idtolistings[id].seller,"Seller cannot be buyer");

	 idtolistings[id].isSold = true;
      activeItems[idtolistings[id].tokenId] = false;
		// Listing storage listing = _listings[listingId];

		// require(msg.sender != listing.seller, "Seller cannot be buyer");

		// require(listing.status == ListingStatus.Active, "Listing is not active");

		// require(msg.value >= listing.price, "Insufficient payment");

		// listing.status = ListingStatus.Sold;
		token.safeTransferFrom(idtolistings[id].seller, msg.sender, idtolistings[id].tokenId);
		_ItemsSold.increment();
      idtolistings[id].seller.transfer(msg.value);

		// IERC721(listing.token).transferFrom(address(this), msg.sender, listing.tokenId);
		// payable(listing.seller).transfer(listing.price);

		emit Sale(
			id,idtolistings[id].tokenId,
			msg.sender,
			idtolistings[id].price
		);
	}

 function totalItemsForSale() external view returns(uint) {
    return Itemscount;
  }
	function getMarketItems() public view returns (Listing[] memory){
		uint itemcount= _ItemIds.current();
		uint unsoldItem= _ItemIds.current() - _ItemsSold.current();

		uint currentIndex= 0;

		Listing[] memory items= new Listing[] (unsoldItem);

		for(uint i=0; i< itemcount;i++)
		{
			if(!idtolistings[i+1].isSold)
			{
				uint curentID= idtolistings[i+1].id;
				Listing storage currentItem= idtolistings[curentID];
				items[currentIndex] = currentItem;
				currentIndex +=1;
			}
		}

		return items;
		
	}
	// function getListing(uint256 id) public view returns (Listing memory) {
	// 	// require(IERC721(token).ownerOf(tokenId) ==msg.sender, "First buy Membership");
	// 	return _listings[listingId];
	// }
    
	

	// function cancel(uint listingId) public {
	// 	Listing storage listing = _listings[listingId];

	// 	require(msg.sender == listing.seller, "Only seller can cancel listing");
	// 	require(listing.status == ListingStatus.Active, "Listing is not active");

	// 	listing.status = ListingStatus.Cancelled;
	
	// 	IERC721(listing.token).transferFrom(address(this), msg.sender, listing.tokenId);

	// 	emit Cancel(listingId, listing.seller);
	// }
}
