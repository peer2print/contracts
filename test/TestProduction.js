var Production = artifacts.require("Production");

contract('Production', function(accounts) {
    let productionInstance

    beforeEach(function () {
        return Production.new().then(instance => {
            productionInstance = instance
        })
    })

  it("should approve request when buyer is not the origin of transaction", function() {
    let sellerAddress = accounts[1]

    return productionInstance.approveRequest({from: sellerAddress}).then(function() {
        return productionInstance.state.call()
    }).then(function(state) {
      assert.equal(state.valueOf(), 1, "Initial state must be O (RequestApproved)");
      return productionInstance.seller.call();
    }).then(function(_sellerAddress) {
      return assert.equal(_sellerAddress, sellerAddress, "Buyer's address is not correct");
    })
  });
});
