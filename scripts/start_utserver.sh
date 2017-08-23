#!/bin/bash

if [[ `./check_server.sh` == "dead" ]]; then
        nohup /opt/utorrent-server-alpha-v3_3/utserver -settingspath /opt/utorrent-server-alpha-v3_3/settings/ -logfile /opt/utorrent-server-alpha-v3_3/utserver.log > /dev/null 2>&1 &
        echo $! > /opt/utorrent-server-alpha-v3_3/utserver.pid
        if [[ $1 !=  "" && $1 == "autokill" ]]; then
            nohup sh -c 'sleep 3600 > /dev/null 2>&1 && /opt/utserver-mobile-ui/scripts/stop_utserver.sh' > /dev/null  2>&1 &
        fi

        if [[ $! != "0" ]]; then
           echo "started"
        else
           echo "failed to start"
        fi

else
        echo "already running"
fi
