#!/bin/bash

if [[ ! -f /opt/utorrent-server-alpha-v3_3/utserver.pid ]]; then
    echo "dead";
else
    PID=`cat /opt/utorrent-server-alpha-v3_3/utserver.pid`
    if [[ `ps -p $PID | wc -l` == 2 ]]; then
        echo "alive"
    else
        echo "dead"
    fi
fi
