#!/bin/sh
testrpc >>testrpc.log 2>>testrpc.log &
echo $! > testrpc.pid
echo "Started testrpc"
