#!/bin/bash
echo "Downloading arduino-cli"
echo "$(dirname $(dirname "$0"))"
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=~/Downloads/sensor_Configurer sh
echo "Installing Libraries: "
../arduino-cli lib install "Adafruit Unified Sensor"
../arduino-cli lib install "DHT sensor library"
../arduino-cli lib install "WiFiNINA"
../arduino-cli lib install "ArduinoMqttClient"
../arduino-cli lib install "Ethernet_Generic"
../arduino-cli lib install "ArduinoJson"
../arduino-cli lib install "ArduinoHttpClient"
echo ""

echo "Installing Board Support: "
../arduino-cli core install "arduino:mbed_nano"
echo ""

echo "Getting Location: "
current_dir=${PWD##*/}
#echo "$current_dir"
#echo "$current_dir.ino"

echo "Compiling Code (may take 30+ seconds): "
../arduino-cli compile ./$current_dir.ino -b arduino:mbed_nano:nanorp2040connect
../arduino-cli board list
echo ""

echo "Enter the port where nanorp2040connect is located: "
read portnum
echo ""

echo "Loading code on Sensor Module: "
../arduino-cli upload ./$current_dir.ino -b "arduino:mbed_nano:nanorp2040connect" -p $portnum
echo "Success!"
