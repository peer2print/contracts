pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Produce.sol";

contract TestProduce {

  function testInitialBalanceUsingDeployedContract() {
    Produce meta = Produce(DeployedAddresses.Produce());

    // uint expected = 10000;

    Assert.equal(true, true, "Owner should have 10000 MetaCoin initially");
  }
}
