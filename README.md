# scc-sensor
This is the sensor repository for the Oregon State University Sensor-Based In-Home Climate Control Capstone Project

## Use Case
The [Sensor_Configurer_App](https://github.com/sensor-climate-control/scc-sensor/tree/main/Sensor_Configuer_App) is a ElectronJS desktop app which allows for the configuration of arduinos in order to be used by the project.
The [Example_Sensor](https://github.com/sensor-climate-control/scc-sensor/tree/main/Example_Sensor) folder contains a boiler plate [Example_Sensor.ino](https://github.com/sensor-climate-control/scc-sensor/blob/main/Example_Sensor/Example_Sensor.ino) arduino program file as well as [arduino_secrets.h](https://github.com/sensor-climate-control/scc-sensor/blob/main/Example_Sensor/arduino_secrets.h) which stores user inputs. The [arduino_secrets.h](https://github.com/sensor-climate-control/scc-sensor/blob/main/Example_Sensor/arduino_secrets.h) file is configured by the [Sensor_Configurer_App](https://github.com/sensor-climate-control/scc-sensor/tree/main/Sensor_Configuer_App) desktop app.

## Required Hardware
- [Arduino Nano RP2040 Connect](https://docs.arduino.cc/hardware/nano-rp2040-connect)
- [DHT11 - Temperature and Humidity Sensor](https://components101.com/sensors/dht11-temperature-sensor)
- [Raspberry Pi 4 Model B Rev 1.2](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)
> *Raspberry Pie is optional if the http method is used in the arduino configuration*

## Sensor Module Configuration Tool Startup
Install [NodeJS](https://nodejs.org/en/download/) and ensure you have [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.  
Navigate to [Sensor_Configurer_App](https://github.com/sensor-climate-control/scc-sensor/tree/main/Sensor_Configuer_App) and use the following commands:
```sh
npm install
npm run start
```
Then navigate to the executable

## Example arduino_secrets.h
```C++
#define SECRET_SSID "myssidforlocalnetwork"
#define SECRET_PASS "mypasswordforlocalnetwork"
#define SECRET_BROKER "static_ip_for_raspberrypi"
#define SECRET_SENSORTOPIC "sensors/generated_sensorID/readings" //only the generated_sensorID is changed
#define SECRET_SERVER "my_domain_name" //domain name or IP for a server you wish to receive the data
#define SECRET_HOMEURL "/api/homes/generated_homeID/" //only the generated_homeID is changed
#define SECRET_TOKEN "Bearer generated_token"
#define SECRET_METHOD "http" //can be either "http" or "mqtt"
#define SECRET_INTERVAL "interval in milliseconds"
```
