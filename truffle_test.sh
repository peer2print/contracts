#!/bin/sh
echo "Adding local binaries in front of PATH"
export PATH=$(npm bin):$PATH && echo "SUCCESS"
echo "Starting testrpc"
testrpc >>testrpc.log 2>>testrpc.log &
echo "Testing"
truffle test && echo "SUCCESS"
