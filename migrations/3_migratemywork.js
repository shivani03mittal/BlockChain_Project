var MembershipNFT = artifacts.require("./MembershipNFT.sol");
var Market = artifacts.require("./Market.sol");

module.exports =  async  function(deployer) {
  await deployer.deploy(MembershipNFT);
  const token = await  MembershipNFT.deployed()

   await deployer.deploy(Market, token.address)

  const market =  await Market.deployed()
  await token.setMarketplace(market.address)
  // deployer.deploy(Market);
};
