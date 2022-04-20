// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract Market {
	enum ListingStatus {
		Active,
		Sold,
		Cancelled
	}

	struct Listing {
		ListingStatus status;
		address seller;
		address token;   //address to token contract
		uint tokenId;
		uint price;
	}

	event Listed(
		uint listingId,
		address seller,
		address token,
		uint tokenId,
		uint price
	);

	event Sale(
		uint listingId,
		address buyer,
		address token,
		uint tokenId,
		uint price
	);

	event Cancel(
		uint listingId,
		address seller
	);

uint public itemcount =0;
	uint private _listingId = 0;
	mapping(uint => Listing) private _listings;

	

	function listToken(address token, uint tokenId, uint price) external {
		// require(IERC721(token).ownerOf(tokenId) ==msg.sender, "First buy Membership");
		IERC721(token).transferFrom(msg.sender, address(this), tokenId);

		Listing memory listing = Listing(
			ListingStatus.Active,
			msg.sender, //seller(current address)
			token,
			tokenId,
			price
		);

		_listingId++;
		itemcount++;

		_listings[_listingId] = listing;

		emit Listed(
			_listingId,
			msg.sender,
			token,
			tokenId,
			price
		);
	}

// modifier member(){
// 		// require(IERC721(token).ownerOf(tokenId) ==msg.sender, "First buy Membership");
// 	}
	function getListing(uint listingId) public view returns (Listing memory) {
		// require(IERC721(token).ownerOf(tokenId) ==msg.sender, "First buy Membership");
		return _listings[listingId];
	}

    
	function buyToken(uint listingId) external payable {
		Listing storage listing = _listings[listingId];

		require(msg.sender != listing.seller, "Seller cannot be buyer");

		require(listing.status == ListingStatus.Active, "Listing is not active");

		require(msg.value >= listing.price, "Insufficient payment");

		listing.status = ListingStatus.Sold;

		IERC721(listing.token).transferFrom(address(this), msg.sender, listing.tokenId);
		payable(listing.seller).transfer(listing.price);

		emit Sale(
			listingId,
			msg.sender,
			listing.token,
			listing.tokenId,
			listing.price
		);
	}
    
	

	function cancel(uint listingId) public {
		Listing storage listing = _listings[listingId];

		require(msg.sender == listing.seller, "Only seller can cancel listing");
		require(listing.status == ListingStatus.Active, "Listing is not active");

		listing.status = ListingStatus.Cancelled;
	
		IERC721(listing.token).transferFrom(address(this), msg.sender, listing.tokenId);

		emit Cancel(listingId, listing.seller);
	}
}
