var Production = artifacts.require("./Production.sol");
var ProductionRegistry = artifacts.require("./ProductionRegistry.sol");

module.exports = function(deployer) {
	deployer.deploy(Production, "test", 3);
	deployer.deploy(ProductionRegistry);
};
