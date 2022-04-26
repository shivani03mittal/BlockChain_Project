const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { assert } = require('chai')
const MembershipNFT = artifacts.require("./MembershipNFT.sol");
const Market = artifacts.require("./Market.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()


contract("Market", (accounts) => {
  let market;
  let Marketplace;
  let Token;
  let token;
  let maddress;
  let toeknadd;


  const minter = accounts[1];
    const tokenId = new BN(1);
    const id = new BN(1);
    const price = new BN(1000);

  before(async () => {
    
    token = await MembershipNFT.deployed();
    // await token.deployed();
    toeknadd = token.address;
    
    market = await Market.deployed(toeknadd);
    // await market.deployed();
    maddress= market.address;
    
     console.log(toeknadd);
     console.log(maddress);
  
  });

  it("Should deploy.", async () => {
    assert.notEqual(token,"");
    assert.notEqual(market,"");
    
  });

  
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = token.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    });

    it('has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'Membership')
    });

    it('has a symbol', async () => {
      const symbol = await token.symbol()
      assert.equal(symbol, 'MembNFT')
    });
})

describe('minting', async () => {
    it('creates a new token', async () => {
      const result = await token.mint('#EC058E')

      const event = result.logs[0].args
      const tokenId = event.tokenId.toNumber()
      const totalSupply = await token.totalSupply()
      const item = await token.Items(tokenId)
      const owner = await token.ownerOf(tokenId)
      const approvedAddress = await token.getApproved(tokenId)
      console.log(approvedAddress)

      //success
      assert.equal(tokenId, totalSupply, 'id is correct')
      assert.equal(item.uri, '#EC058E', 'color is correct')
      assert.equal(item.creator, owner, 'creator is correct')
      // assert.equal(approvedAddress, market.address, 'approved address is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')
    })
  })

  describe('indexing', async () => {
    it('lists colors', async () => {
      //mint 3 more tokens
      await token.mint('#5386E4')
      await token.mint('#FFFFFF')
      await token.mint('#000000')

      const totalSupply = await token.totalSupply()
      let item
      let result = []

      for (var i=1; i <= totalSupply; i++){
        item = await token.Items(i)
        result.push(item.uri)
      }

      let expected = ['#EC058E', '#5386E4', '#FFFFFF', '#000000']
      assert.equal(result.join(','), expected.join(','))
    })
  })
//   it("...getminted and added",async () => {
//     const result = await token.mint(maddress);
//     console.log(result);

//   });

  // it("...getlistedbyseller",async() => {
  //   const list = await market.listToken(tokenId,price);
  //   console.log(list);
  // });

  

  // ----------------------------------------------

  describe('List token', () => {

    before(async () => {

      token = await MembershipNFT.deployed();
      toeknadd = token.address;
    
    market = await Market.deployed(toeknadd);
    maddress= market.address;

    await token.setMarketplace(market.address)
    
      await token.mint('#EC058E',{ from: minter });
    });

    // it('should prevent Listing - contract not approved', () => {
    //     return expectRevert(
    //         market.listToken(
    //             tokenId,
    //             price
    //         ), 'ERC721: transfer caller is not owner nor approved');
    // });

    it('should execute Listing ', async () => {
      // await token.approve(market.address, tokenId, {
      //     from: minter
      // });

      const tx = await market.listToken(
          
          tokenId,
          price
      );

      expectEvent(tx, 'ListedForSale', {
          id,
          tokenId,
          price
      });

      const apr= await token.getApproved(tokenId);
      // const owner = await token.ownerOf(tokenId);
      assert.equal(apr, market.address, "Market contract is not approved.");


  });

    });


// const buyer = accounts[2];

//     describe('Buy token ', () => {
//         before(async () => {
//           token = await MembershipNFT.deployed();
//           toeknadd = token.address;
    
//           market = await Market.deployed(toeknadd);
//           maddress= market.address;
            
//           await token.mint('#EC058E',{ from: minter });
          
//           await market.listToken(
          
//             tokenId,
//             price
//         );
            
//         });

//         // it('should prevent sale - seller cannot be buyer', () => {
//         //     return expectRevert(
//         //         market.buyToken(id, { from: buyer }),
//         //         'Seller cannot be buyer'
//         //     );
//         // });

//         it('should prevent sale - insufficient payment', () => {
//             return expectRevert(
//                 market.buyToken(id, {
//                     from: buyer,
//                     value: 1
//                 }),
//                 'Insufficient payment'
//             );
//         })

// //         it('should execute sale', async () => {
// //             const tx = await market.buyToken(listingId, {
// //                 from: buyer,
// //                 value: price
// //             });

// //             expectEvent(tx, 'Sale', {
// //                 listingId,
// //                 buyer,
// //                 token: token.address,
// //                 tokenId,
// //                 price
// //             });

// //             return token.ownerOf(tokenId).then(owner => {
// //                 assert.equal(owner, buyer, "Buyer is not the new owner.");
// //             });
// //         })

// //         it('should prevent sale - listing is not active', () => {
// //             return expectRevert(
// //               market.buyToken(listingId, {
// //                 from: buyer,
// //                 value: price
// //               }),
// //               'Listing is not active'
// //             );
// //         });   
//     });

//     describe('Cancel listing', () => {
//       before(async () => {
//           market = await Market.new();
//           // token = await NFT.new();
//           token = await MembershipNFT.new();

//           await token.mint(maddress,{ from: minter });
//           await token.approve(market.address, tokenId, {
//               from: minter
//           });

//           await market.listToken(
//               token.address,
//               tokenId,
//               price,
//               { from: minter }
//           );
//       });

//       it('should prevent cancellation - only seller can cancel', () => {
//           return expectRevert(
//               market.cancel(listingId, { from: buyer }),
//               'Only seller can cancel listing'
//           );
//       })

//       it('should execute cancellation', async () => {
//           const tx = await market.cancel(listingId, { from: minter });

//           expectEvent(tx, 'Cancel', {
//               listingId,
//               seller: minter
//           });
//       })

//       it('should prevent cancellation - listing is not active', () => {
//           return expectRevert(
//               market.cancel(listingId, { from: minter }),
//               'Listing is not active'
//           );
//       })
//   });
});
