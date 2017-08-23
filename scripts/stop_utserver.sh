#!/bin/bash
kill -9 `cat /opt/utorrent-server-alpha-v3_3/utserver.pid`

rm /opt/utorrent-server-alpha-v3_3/utserver.pid

echo "stopped"
