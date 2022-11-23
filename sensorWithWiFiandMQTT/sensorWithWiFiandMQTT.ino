#include "DHT.h"
#include <SPI.h>
#include <WiFiNINA.h>
#include <ArduinoMqttClient.h>
#include <PubSubClient.h>
#define DHTPIN 2     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11   // DHT 11

// Adapted From: https://docs.arduino.cc/tutorials/uno-wifi-rev2/uno-wifi-r2-mqtt-device-to-device

//replace with network login info
char ssid[] = "Redfernj";       
char pass[] = "00226573";

//WiFiSSLClient client;

// const char* mqtt_server = "ip"; //change to ip of rasp broker

WiFiClient wifi_client;
MqttClient mqtt_client(wifi_client);

const char  broker[]      = "sensor.mosquitto.org";
int         port          = 1883;
const char  test_topic[]  = "test";

const long interval = 8000;
unsigned long previousMillis = 0;

int count = 0;

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ;
  }

  Serial.print("Attempting to conect to WPA SSID: ");
  Serial.println(ssid);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    Serial.print(".");
    delay(5000);
  }

  Serial.println("You're connected to the network");
  Serial.println();

  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  if(!mqtt_client.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqtt_client.connectError());

    while (1);
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();

}

void loop() {

}