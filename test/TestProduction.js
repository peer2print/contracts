var Production = artifacts.require("Production");

contract('Production', function(accounts) {
    let productionInstance
    let price = 3
    let description = "test"

    beforeEach(function () {
        return Production.new(description, price).then((instance) => {
            productionInstance = instance
        })
    })

    function catchSolidityThrow(error) {
      if(error.toString().indexOf("invalid opcode") !== -1) {
        assert(false, "We were expecting a Solidity throw (aka an invalid opcode)")
      }
    }

  it("should approve request when buyer is not the origin of transaction", function() {
    let sellerAddress = accounts[1]

    return productionInstance.approveRequest({from: sellerAddress}).then(function() {
        return productionInstance.state.call()
    }).then((state) => {
      assert.equal(state.valueOf(), 1, "Initial state must be O (RequestApproved)")
      return productionInstance.seller.call()
    }).then((_sellerAddress) => {
      return assert.equal(_sellerAddress, sellerAddress, "Buyer's address is not correct")
    })
  });

  it("should throw when bad amount of collateral is paid by the buyer", function() {
    return productionInstance.sendCollateral({value: 2}).catch((error) => {
      return catchSolidityThrow(error)
    })
  });

  it("should throw when the collateral transaction is not sent by the buyer", function() {
    let otherAddress = accounts[1]

    return productionInstance.sendCollateral({value: 2, account: otherAddress}).catch((error) => {
      return catchSolidityThrow(error)
    })
  });

  it("should throw sending collateral when the contract's state is not in RequestApproved", function() {
    return productionInstance.sendCollateral({value: price}).catch((error) => {
      return catchSolidityThrow(error)
    })
  });

  it("should change contract's state when all good with sending collateral", function() {   
    function setup() {
      let otherAddress = accounts[1]
      return productionInstance.approveRequest({from: otherAddress})
    }
    
    function exercice() {
      return productionInstance.sendCollateral({value: 3}).then(() => {
        return productionInstance.state.call()
      })
    }

    function verify(state) {
      return assert.equal(state, 2, "state must be in RequestApproved")
    }

    return setup().then(exercice).then(verify)
  });
});
