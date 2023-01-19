#!/bin/bash

echo "Installing Libraries: "
./arduino-cli.exe lib install "Adafruit Unified Sensor"
./arduino-cli.exe lib install "DHT sensor library"
./arduino-cli.exe lib install "WiFiNINA"
./arduino-cli.exe lib install "ArduinoMqttClient"
./arduino-cli.exe lib install "Ethernet_Generic"
echo ""

echo "Installing Board Support: "
./arduino-cli.exe core install "arduino:mbed_nano"
echo ""

echo "Compiling Code (may take 30+ seconds): "
./arduino-cli.exe compile ./sensor1.ino -b arduino:mbed_nano:nanorp2040connect
./arduino-cli.exe board list
echo ""

echo "Enter the port where nanorp2040connect is located: "
read portnum
echo ""

echo "Loading code on Sensor Module: "
./arduino-cli.exe upload ./sensor1.ino -b "arduino:mbed_nano:nanorp2040connect" -p $portnum
echo "Success!"