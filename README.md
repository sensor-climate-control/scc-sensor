# scc-sensor
This is the sensor repository for the Oregon State University Sensor-Based In-Home Climate Control Capstone Project

## Use Case
The [desktop_app_arduino](https://github.com/sensor-climate-control/scc-sensor/tree/main/desktop_app_arduino) is a ElectronJS desktop app which allows for the configuration of arduinos in order to be used by the project.
The [sensor2](https://github.com/sensor-climate-control/scc-sensor/tree/main/sensor2) contains a boiler plate [sensor2.ino](https://github.com/sensor-climate-control/scc-sensor/blob/main/sensor2/sensor2.ino) arduino program file as well as [arduino_secrets.h](https://github.com/sensor-climate-control/scc-sensor/blob/main/sensor2/arduino_secrets.h) which stores user inputs. The [arduino_secrets.h](https://github.com/sensor-climate-control/scc-sensor/blob/main/sensor2/arduino_secrets.h) file is what the [desktop_app_arduino](https://github.com/sensor-climate-control/scc-sensor/tree/main/desktop_app_arduino) is configuring.

## Required Hardware
- [Arduino Nano RP2040 Connect](https://docs.arduino.cc/hardware/nano-rp2040-connect)
- [DHT11 - Temperature and Humidity Sensor](https://components101.com/sensors/dht11-temperature-sensor)
- [Raspberry Pi 4 Model B Rev 1.2](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)
> *Raspberry Pie is optional if the http method is used in the arduino configuration*

## Sensor Module Configuration Tool Startup
Navigate to [desktop_app_arduino](https://github.com/sensor-climate-control/scc-sensor/tree/main/desktop_app_arduino) and use the following commands:
```sh
npm install
npm start
```

## Example arduino_secrets.h
```C++
#define SECRET_SSID "myssidforlocalnetwork"
#define SECRET_PASS "mypasswordforlocalnetwork"
#define SECRET_BROKER "static_ip_for_raspberrypi"
#define SECRET_SENSORTOPIC "sensors/generated_sensorID/readings" //only the generated_sensorID is changed
#define SECRET_SERVER "my_domain_name" //domain name or IP for a server you wish to receive the data
#define SECRET_HOMEURL "/api/homes/generated_homeID/" //only the generated_homeID is changed
#define SECRET_METHOD "http" //can be either "http" or "mqtt"
```
