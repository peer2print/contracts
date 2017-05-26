#!/bin/sh
#echo "Adding local binaries in front of PATH"
#export PATH=$(npm bin):$PATH && echo "SUCCESS"
echo "Compiling contracts"
solc contracts/* && solc tests/* && echo "SUCCESS"
echo "Starting testrpc"
testrpc >>testrpc.log 2>>testrpc.log &
pid=$!
echo "Testing"
truffle test && echo "SUCCESS"
echo "Stopping testrpc"
kill $pid && echo "SUCCESS"
