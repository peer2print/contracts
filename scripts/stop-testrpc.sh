#!/bin/sh
echo "Stopping testrpc"
kill `cat testrpc.pid` &&
rm testrpc.pid &&
echo "SUCCESS"
