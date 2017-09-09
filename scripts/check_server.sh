#!/bin/bash

if [[ ! -f /opt/utserver-mobile-ui/scripts/utserver.pid ]]; then
    echo "dead";
else
    PID=`cat /opt/utserver-mobile-ui/scripts/utserver.pid`
    if [[ `ps -p $PID | wc -l` == 2 ]]; then
        echo "alive"
    else
        echo "dead"
    fi
fi
