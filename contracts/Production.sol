pragma solidity ^0.4.4;

contract Production {
	State public state;
	address public buyer;
	uint price;
	enum State {
		RequestSent,
    	RequestApproved,
    	ProductFinished,
    	ProductExchanged
	}

	function Production() {
		buyer = tx.origin;
		state = State.RequestSent;
	}
}
