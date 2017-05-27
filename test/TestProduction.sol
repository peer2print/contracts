pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Production.sol";
import "./ThrowProxy.sol";

contract TestProduction {
  event Debug(uint debug);

  function testInitialVariablesAreSet() {
    // Given
    Production production = new Production("test", 3);

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
    Production production = new Production("test", 3);

    // When
    production.approveRequest();

    // then
    Assert.isTrue(production.state() == Production.State.RequestSent, "State must be RequestSent");
    Assert.isTrue(production.seller() == address(0), "seller's address must be null");
  }

  function testSendCollateralThrowSetWhenBuyerIsNotOrigin() {
    // Given
    Production production = new Production("test", 3);
    //set Production as the contract to forward requests to. The target.
    ThrowProxy throwProxy = new ThrowProxy(address(production));

    Debug(this.balance);
    // When
    // TODO: send() will fail because there is no ether on this address
    Production(address(throwProxy)).sendCollateral();
    //execute the call that is supposed to throw.
    bool hasThrown = !throwProxy.execute.gas(200000)();

    // Then
    Assert.isTrue(hasThrown, "sendCollateral should throw when buyer is not origin");
  }
}
