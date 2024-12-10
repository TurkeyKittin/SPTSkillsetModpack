#!/bin/bash

# Determine the backend IP address
IP=${backendIp:-$(hostname -I | awk '{print $1}')}

# Determine the backend port
PORT=${backendPort:-6969}

# Determine the WebSocket ping delay in milliseconds
PINGDELAYMS=${webSocketPingDelayMs:-90000}

# Update the http.json configuration file
sed -i "0,/127.0.0.1/s/127.0.0.1/${IP}/" SPT_Data/Server/configs/http.json
sed -i "s/[0-9]\{1,\},/${PORT},/g" SPT_Data/Server/configs/http.json
tac SPT_Data/Server/configs/http.json | sed "0,/${PORT},/s/${PORT},/$PINGDELAYMS,/" | tac | tee SPT_Data/Server/configs/http.json > /dev/null

# Make the SPT.Server.exe file executable and run it
chmod +x SPT.Server.exe && ./SPT.Server.exe