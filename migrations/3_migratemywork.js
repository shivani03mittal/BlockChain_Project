var MembershipNFT = artifacts.require("./MembershipNFT.sol");
var Market = artifacts.require("./Market.sol");

module.exports = function(deployer) {
  deployer.deploy(MembershipNFT);
  deployer.deploy(Market);
};
