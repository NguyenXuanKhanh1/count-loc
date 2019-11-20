#!/bin/bash

cd /tmp || exit
echo "Downloading sonar-scanner....."
if [ -d "/tmp/sonar-scanner-cli-4.2.0.1873-linux.zip" ];then
    rm /tmp/sonar-scanner-cli-4.2.0.1873-linux.zip
fi
wget -q https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.2.0.1873-linux.zip
echo "Download completed."

echo "Unziping downloaded file..."
unzip sonar-scanner-cli-4.2.0.1873-linux.zip
echo "Unzip completed."
rm sonar-scanner-cli-4.2.0.1873-linux.zip

echo "Installing to opt..."
if [ -d "/var/opt/sonar-scanner-cli-4.2.0.1873-linux" ];then
    rm -rf /var/opt/sonar-scanner-cli-4.2.0.1873-linux
fi
mv sonar-scanner-4.2.0.1873-linux /var/opt

ln -s /var/opt/sonar-scanner-4.2.0.1873-linux/bin/sonar-scanner /usr/local/bin/sonar-scanner

echo "Installation completed successfully."

echo "You can use sonar-scanner!"

