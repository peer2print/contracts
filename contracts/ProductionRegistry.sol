pragma solidity ^0.4.4;

import "./Production.sol";

contract ProductionRegistry {
	Production[] public	productions;

	function addProduction(Production prod) {
		productions.push(prod);
	}

	function getProductionsCount() constant returns (uint) {
		return productions.length;
	}
}
