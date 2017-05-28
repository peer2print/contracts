var Production = artifacts.require("Production");

contract('Production', function(accounts) {
    let productionInstance
    let price = 3
    let description = "test"
    let buyerAddress = accounts[0]
    let sellerAddress = accounts[1]
    let otherAddress = accounts[2]

    beforeEach(function () {
        return Production.new(description, price).then((instance) => {
            productionInstance = instance
        })
    })

    function catchSolidityThrow(error) {
      if(error.toString().indexOf("invalid opcode") == -1) {
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
    return productionInstance.sendCollateral({value: 2, from: buyerAddress}).catch((error) => {
      return catchSolidityThrow(error)
    })
  });

  it("should throw when the collateral transaction is not sent by the buyer", function() {

    return productionInstance.sendCollateral({value: 2, from: otherAddress}).catch((error) => {
      return catchSolidityThrow(error)
    })
  });

  it("should throw sending collateral when the contract's state is not in RequestApproved", function() {
    return productionInstance.sendCollateral({value: price, from: buyerAddress}).catch((error) => {
      return catchSolidityThrow(error)
    })
  });

  it("should change contract's state when all good with sending collateral", function() {   
    function setup() {
      return productionInstance.approveRequest({from: otherAddress})
    }
    
    function exercice() {
      return productionInstance.sendCollateral({value: 3, from: buyerAddress}).then(() => {
        return productionInstance.state.call()
      })
    }

    function verify(state) {
      return assert.equal(state.valueOf(), 2, "state must be in RequestApproved")
    }

    return setup().then(exercice).then(verify)
  });

  it("should not change contract's state ProductFinished's transaction origin is not seller", function() {   
    function setup() {
      return productionInstance.approveRequest({from: sellerAddress})
      .then(() => {
        return productionInstance.sendCollateral({value: 3, account: buyerAddress})
      })
    }
    
    function exercice() {
      return productionInstance.productFinished({from: buyerAddress}).then(() => {
        return productionInstance.state.call()
      })
    }

    function verify(state) {
      return assert.equal(state.valueOf(), 2, "state must be in RequestApproved")
    }

    return setup().then(exercice).then(verify)
  });

  it("should not change contract's state ProductFinished's when state is not in CollateralPaid", function() {   
    function setup() {
      return productionInstance.approveRequest({from: sellerAddress})
    }
    
    function exercice() {
      return productionInstance.productFinished({from: sellerAddress}).then(() => {
        return productionInstance.state.call()
      })
    }

    function verify(state) {
      return assert.equal(state.valueOf(), 1, "state must be in RequestApproved")
    }

    return setup().then(exercice).then(verify)
  });

  it("should set contract's state in ProductFinished's when transaction origin is seller", function() { 
    function setup() {
      return productionInstance.approveRequest({from: sellerAddress})
      .then(() => {
        return productionInstance.sendCollateral({value: 3, from: buyerAddress})
      })
    }
    
    function exercice() {
      return productionInstance.productFinished({from: sellerAddress}).then(() => {
        return productionInstance.state.call()
      })
    }

    function verify(state) {
      return assert.equal(state.valueOf(), 3, "state must be in ProductFinished")
    }

    return setup().then(exercice).then(verify)
  });

  it("should throw when productExchanged confirmation origin of transaction is not seller or buyer", function() { 
    function setup() {
      return productionInstance.approveRequest({from: sellerAddress})
      .then(() => {
        return productionInstance.sendCollateral({value: 3, from: buyerAddress})
      }).then(() => {
        return productionInstance.productFinished({from: sellerAddress})
      })
    }
    
    function exercice() {
      return productionInstance.productExchanged({from: otherAddress}).catch((error) => {
       return catchSolidityThrow(error)
      })
    }

    return setup().then(exercice)
  });

  it("should throw when productExchanged confirmation is made while the state is incorrect", function() { 
    function setup() {
      return productionInstance.approveRequest({from: sellerAddress})
      .then(() => {
        return productionInstance.sendCollateral({value: 3})
      })
    }
    
    function exercice() {
      return productionInstance.productExchanged({from: otherAddress}).catch((error) => {
       return catchSolidityThrow(error)
      })
    }

    return setup().then(exercice)
  });

  it("should confirm ProductExchanged only by the seller", function() { 
    function setup() {
      return productionInstance.approveRequest({from: sellerAddress})
      .then(() => {
        return productionInstance.sendCollateral({value: 3})
      }).then(() => {
        return productionInstance.productFinished({from: sellerAddress})
      })
    }
    
    function exercice() {
      return productionInstance.productExchanged({from: sellerAddress}).then(() => {
        return productionInstance.exchangeConfirmations.call()
      })
    }

    function verify(confirmations) {
      assert.equal(confirmations[0], false, "buyer must not have confirmed the exchange")
      assert.equal(confirmations[1], true, "seller must have confirmed the exchange")
    }

    return setup().then(exercice).then(verify)
  });

  it("should confirm ProductExchanged only by the buyer", function() { 
    function setup() {
      return productionInstance.approveRequest({from: sellerAddress})
      .then(() => {
        return productionInstance.sendCollateral({value: 2})
      }).then(() => {
        return productionInstance.productFinished({from: sellerAddress})
      })
    }
    
    function exercice() {
      return productionInstance.productExchanged({from: buyerAddress, value: 1}).then(() => {
        return productionInstance.exchangeConfirmations.call()
      })
    }

    function verify(confirmations) {
      assert.equal(confirmations[0], true, "buyer must have confirmed the exchange")
      assert.equal(confirmations[1], false, "seller must not have confirmed the exchange")
    }

    return setup().then(exercice).then(verify)
  });

  it("should set state on ProductExchanged when both seller and buyer confirm", function() { 
    function setup() {
      return productionInstance.approveRequest({from: sellerAddress})
      .then(() => {
        return productionInstance.sendCollateral({value: 3})
      }).then(() => {
        return productionInstance.productFinished({from: sellerAddress})
      })
    }
    
    function exercice() {
      let exchangeConfirmations
      return productionInstance.productExchanged({from: sellerAddress})
      .then(() => {
        return productionInstance.productExchanged({from: buyerAddress})
      }).then(() => {
        return productionInstance.exchangeConfirmations.call()
      }).then((_exchangeConfirmations) => {
        exchangeConfirmations = _exchangeConfirmations
        return productionInstance.state.call()
      }).then((_state) => {
        return Promise.resolve([exchangeConfirmations, _state])
      })
    }

    function verify([exchangeConfirmations, state]) {
      assert.equal(exchangeConfirmations[0], true, "buyer must have confirmed the exchange")
      assert.equal(exchangeConfirmations[1], true, "seller must have confirmed the exchange")
      assert.equal(state.valueOf(), 4, "state must be on ProductExchanged (4)")
    }

    return setup().then(exercice).then(verify)
  });
});
