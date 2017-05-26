pragma solidity ^0.4.4;

contract Production {
	State public state;
	address public buyer;
	bytes32 public description;
	uint public price;
	address public seller;

	enum State {
		RequestSent,
    	RequestApproved,
		CollateralPaid,
    	ProductFinished,
    	ProductExchanged,
		SellerPaid
	}

	function Production(bytes32 _description, uint _price) {
		buyer = tx.origin;
		description = _description;
		price = _price;
		state = State.RequestSent;
	}

	function approveRequest() notBuyer {
		seller = tx.origin;
		state = State.RequestApproved;
	}

	function sendCollateral() onlyBuyer payable {
		if (msg.value != uint(price / 2)) {
			throw;
		} else {
			state = State.CollateralPaid;
		}
	}

	modifier notBuyer {
		if (tx.origin != buyer) {
			_;
		}
	}

	modifier onlyBuyer {
		if (tx.origin == buyer) {
			_;
		}
	}



}
