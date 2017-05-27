#!/bin/sh
echo "Compiling contracts"
solc contracts/* && echo "SUCCESS"
npm run start-testrpc
echo "Testing"
truffle test && echo "SUCCESS" &&
npm run stop-testrpc
