pragma solidity ^0.4.4;

contract Production {
	State public state;
	address public buyer;
	bytes32 public description;
	uint public price;
	uint public minimumCollateral;
	address public seller;
	BilateralConfirmation public exchangeConfirmations;

	struct BilateralConfirmation {
		bool buyer;
		bool seller;
	}

	enum State {
		RequestSent,
    	RequestApproved,
		CollateralPaid,
    	ProductFinished,
    	ProductExchanged,
		SellerPaid
	}

	function () {
		// Fallback function does not accept ether
	}

	function Production(bytes32 _description, uint _price) {
		buyer = tx.origin;
		description = _description;
		price = _price;
		minimumCollateral = uint(_price) / uint(3);
		state = State.RequestSent;
	}

	function approveRequest() notBuyer {
		seller = tx.origin;
		state = State.RequestApproved;
	}

	function sendCollateral() payable onlyBuyer whenRequestApprovedState {
		if (msg.value <= minimumCollateral) {
			throw;
		} else {
			state = State.CollateralPaid;
		}
	}

	function productFinished() onlySeller whenCollateralPaidState {
		state = State.ProductFinished;
	}

	function productExchanged() payable sellerAndBuyer whenProductFinishedState {
		if (tx.origin == buyer && (msg.value + this.balance) >= price) {
			exchangeConfirmations.buyer = true;
		} else if (tx.origin == seller) {
			exchangeConfirmations.seller = true;
		} else {
			throw;
		}
		
		if (exchangeConfirmations.buyer && exchangeConfirmations.seller) {
			state = State.ProductExchanged;
		}
	}

	// TODO: getReward() payable onlySeller whenProductExchangedState {}

	/***************
	/*	Modifiers  *
	****************/	

	modifier notBuyer {
		if (tx.origin != buyer) {
			_;
		}
	}

	modifier onlyBuyer {
		if (tx.origin == buyer) {
			_;
		} else {
			throw;
		}
	}

	modifier onlySeller {
		if (tx.origin == seller) {
			// Throw is not needed here because the function is not payable
			_;
		}
	}

	modifier sellerAndBuyer {
		if (tx.origin == seller || tx.origin == buyer) {
			_;
		} else {
			throw;
		}
	}

	modifier whenRequestApprovedState {
		if (state == State.RequestApproved) {
			_;
		} else {
			throw;
		}
	}

	modifier whenCollateralPaidState {
		if (state == State.CollateralPaid) {
			// Throw is not needed here because the function is not payable
			_;
		}
	}

	modifier whenProductFinishedState {
		if (state == State.ProductFinished) {
			_;
		} else {
			throw;
		}
	}
}
