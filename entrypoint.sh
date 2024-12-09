#!/bin/bash

# Function to copy server files
copy_server_files() {
  echo "Copying server files to /opt/spt-server..."
  cp -r /app/spt-server /opt
  echo "Finished!"
}

# Check if the SPT.Server.exe file exists in the /opt/spt-server directory
if [ -f /opt/spt-server/SPT.Server.exe ]; then
  # Calculate the MD5 hashes
  appHash=$(md5sum /app/spt-server/SPT.Server.exe | awk '{ print $1 }')
  exeHash=$(md5sum /opt/spt-server/SPT.Server.exe | awk '{ print $1 }')
  
  # Compare the hashes to verify the integrity of the file
  if [ "$appHash" = "$exeHash" ]; then
    echo "MD5 verification successful!"
  else
    echo "MD5 mismatch."
    copy_server_files
  fi
else
  echo "Program not found."
  copy_server_files
fi

# Change the working directory to /opt/spt-server
cd /opt/spt-server

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