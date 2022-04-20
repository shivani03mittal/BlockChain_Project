const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const MembershipNFT = artifacts.require("./MembershipNFT.sol");
const Market = artifacts.require("./Market.sol");

contract("Market", accounts => {
  let market;
  let token;
  let maddress;
  let toeknadd;

  const minter = accounts[1];
    const tokenId = new BN(1);
    const listingId = new BN(1);
    const price = new BN(1000);

  before(async () => {
    market = await Market.deployed();

    token = await MembershipNFT.deployed();
     maddress= Market.address;
    toeknadd = MembershipNFT.address;
     console.log(maddress);
  
  });

  it("Should deploy.", async () => {
    assert.notEqual(market,"");
    assert.notEqual(token,"");
  });

  // it("...getminted and added",async () => {
  //   const result = await token.mint(maddress);
  //   console.log(result);

  // });

  // it("...getlistedbyseller",async() => {
  //   const list = await market.listToken(toeknadd,tokenId,price);
  //   console.log(list);
  // });


  // ----------------------------------------------

  describe('List token', () => {

    before(async () => {
      market = await Market.deployed();

      token = await MembershipNFT.deployed();
        // token2= await Membership.new();

        await token.mint(maddress,{ from: minter });
    });

    it('should prevent Listing - contract not approved', () => {
        return expectRevert(
            market.listToken(
                token.address,
                tokenId,
                price
            ), 'ERC721: transfer caller is not owner nor approved');
    });

    it('should execute Listing ', async () => {
        await token.approve(market.address, tokenId, {
            from: minter
        });

        const tx = await market.listToken(
            token.address,
            tokenId,
            price,
            { from: minter }
        );

        expectEvent(tx, 'Listed', {
            listingId,
            seller: minter,
            token: token.address,
            tokenId,
            price
        });


        return token.ownerOf(tokenId).then(owner => {
            assert.equal(owner, market.address, "Market contract is not the new owner.");
        });

    });


});

const buyer = accounts[2];

    describe('Buy token ', () => {
        before(async () => {
            market = await Market.new();
            // token = await NFT.new();
            token = await MembershipNFT.new();

            await token.mint(maddress,{ from: minter });
            await token.approve(market.address, tokenId, {
                from: minter
            });

            await market.listToken(
                token.address,
                tokenId,
                price,
                { from: minter }
            );
        });

        it('should prevent sale - seller cannot be buyer', () => {
            return expectRevert(
                market.buyToken(listingId, { from: minter }),
                'Seller cannot be buyer'
            );
        });

        it('should prevent sale - insufficient payment', () => {
            return expectRevert(
                market.buyToken(listingId, {
                    from: buyer,
                    value: 1
                }),
                'Insufficient payment'
            );
        })

        it('should execute sale', async () => {
            const tx = await market.buyToken(listingId, {
                from: buyer,
                value: price
            });

            expectEvent(tx, 'Sale', {
                listingId,
                buyer,
                token: token.address,
                tokenId,
                price
            });

            return token.ownerOf(tokenId).then(owner => {
                assert.equal(owner, buyer, "Buyer is not the new owner.");
            });
        })

        it('should prevent sale - listing is not active', () => {
            return expectRevert(
              market.buyToken(listingId, {
                from: buyer,
                value: price
              }),
              'Listing is not active'
            );
        });   
    });

    describe('Cancel listing', () => {
      before(async () => {
          market = await Market.new();
          // token = await NFT.new();
          token = await MembershipNFT.new();

          await token.mint(maddress,{ from: minter });
          await token.approve(market.address, tokenId, {
              from: minter
          });

          await market.listToken(
              token.address,
              tokenId,
              price,
              { from: minter }
          );
      });

      it('should prevent cancellation - only seller can cancel', () => {
          return expectRevert(
              market.cancel(listingId, { from: buyer }),
              'Only seller can cancel listing'
          );
      })

      it('should execute cancellation', async () => {
          const tx = await market.cancel(listingId, { from: minter });

          expectEvent(tx, 'Cancel', {
              listingId,
              seller: minter
          });
      })

      it('should prevent cancellation - listing is not active', () => {
          return expectRevert(
              market.cancel(listingId, { from: minter }),
              'Listing is not active'
          );
      })
  });
});
