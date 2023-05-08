#!/bin/bash
echo "Downloading arduino-cli"
echo "$(dirname $(dirname "$0"))"
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=~/Downloads/sensor_Configurer sh
echo "Installing Libraries: "
../arduino-cli.exe lib install "Adafruit Unified Sensor"
../arduino-cli.exe lib install "DHT sensor library"
../arduino-cli.exe lib install "WiFiNINA"
../arduino-cli.exe lib install "ArduinoMqttClient"
../arduino-cli.exe lib install "Ethernet_Generic"
../arduino-cli.exe lib install "ArduinoJson"
../arduino-cli.exe lib install "ArduinoHttpClient"
echo ""

echo "Installing Board Support: "
../arduino-cli.exe core install "arduino:mbed_nano"
echo ""

echo "Getting Location: "
current_dir=${PWD##*/}
#echo "$current_dir"
#echo "$current_dir.ino"

echo "Compiling Code (may take 30+ seconds): "
../arduino-cli.exe compile ./$current_dir.ino -b arduino:mbed_nano:nanorp2040connect
../arduino-cli.exe board list
echo ""

echo "Enter the port where nanorp2040connect is located: "
read portnum
echo ""

echo "Loading code on Sensor Module: "
../arduino-cli.exe upload ./$current_dir.ino -b "arduino:mbed_nano:nanorp2040connect" -p $portnum
echo "Success!"
