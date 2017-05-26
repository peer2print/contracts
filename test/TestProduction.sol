pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Production.sol";

contract TestProduction {

  function testInitialState() {
    Production production = Production(DeployedAddresses.Production());

    Assert.isTrue(production.state() == Production.State.RequestSent, "Initial state must be RequestSent");
  }

  function testBuyerAddressIsSaved() {
    Production production = Production(DeployedAddresses.Production());

    Assert.isTrue(production.buyer() == tx.origin, "Buyer's address is not correct");
  }
}
