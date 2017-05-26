pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Production.sol";
import "./ThrowProxy.sol";

contract TestProduction {

  function testInitialVariablesAreSet() {
    // Given
    Production production = Production(DeployedAddresses.Production());

    // Then
    Assert.isTrue(production.state() == Production.State.RequestSent, "Initial state must be RequestSent");
    Assert.isTrue(production.buyer() == tx.origin, "Buyer's address is not correct");
    // TODO: get Production's constructor parameters
    // Here, tests are coupled with the contracts deployments from the JS side.
    Assert.isTrue(production.description() == bytes32("test"), "Description is not correct");
    Assert.isTrue(production.price() == uint(3), "Price is not correct");
  }

  function testApprovedRequestVariableAreNotSetWhenBuyerIsOrigin() {
    // Given
    Production production = Production(DeployedAddresses.Production());

    // When
    production.approveRequest();

    // then
    Assert.isTrue(production.state() == Production.State.RequestSent, "State must be RequestSent");
    Assert.isTrue(production.seller() == address(0), "seller's address must be null");
  }

  function testSendCollateralThrowSetWhenBuyerIsNotOrigin() {
    Production productionInstance = new Production("test", 3);
    //set Production as the contract to forward requests to. The target.
    ThrowProxy throwProxy = new ThrowProxy(address(productionInstance));

    //prime the proxy.
    Production(address(throwProxy)).sendCollateral();
    //productionInstance.transfer(1);

    //execute the call that is supposed to throw.
    //r will be false if it threw. r will be true if it didn't.
    //make sure you send enough gas for your contract method.
    bool r = throwProxy.execute.gas(200000)();

    Assert.isFalse(r, "sendCollateral should throw when buyer is not origin");
  }
}
