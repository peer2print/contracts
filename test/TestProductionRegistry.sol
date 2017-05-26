pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProductionRegistry.sol";

contract TestProductionRegistry {

  function testInitialVariablesAreSet() {

    // Given
    ProductionRegistry productionRegistry = ProductionRegistry(DeployedAddresses.ProductionRegistry());

    // Then
    Assert.equal(productionRegistry.getProductionsCount(), 0, "Should have no productions initially");
  }

  function testAddDoesAdd() {

    // Given
    ProductionRegistry productionRegistry = ProductionRegistry(DeployedAddresses.ProductionRegistry());
	Production production = new Production("test", 42);

	// When
	productionRegistry.addProduction(production);

    // Then
    Assert.equal(productionRegistry.getProductionsCount(), 1, "Should have a production after add");

	Production result = productionRegistry.productions(0);

	Assert.equal(result.description(), "test", "Should have the right description");
	Assert.equal(result.price(), 42, "Should have the right price");
	Assert.equal(result.buyer(), tx.origin, "Buyers address is not correct");
  }
}
