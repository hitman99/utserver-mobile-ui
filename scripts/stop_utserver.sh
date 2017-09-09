#!/bin/bash
kill -9 `cat /opt/utserver-mobile-ui/scripts/utserver.pid`

rm /opt/utserver-mobile-ui/scripts/utserver.pid

echo "stopped"
