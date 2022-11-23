#include "DHT.h"
#include <SPI.h>
#include <WiFiNINA.h>
#include <ArduinoMqttClient.h>
#include <PubSubClient.h>

#define DHTPIN 2     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

// Adapted From: https://docs.arduino.cc/tutorials/uno-wifi-rev2/uno-wifi-r2-mqtt-device-to-device

//replace with network login info
char ssid[] = "Redfernj";       
char pass[] = "00226573";

WiFiClient wifi_client;
MqttClient mqtt_client(wifi_client);

const char  broker[]      = "sensor.mosquitto.org";
int         port          = 1883;
const char  temp_topic[]  = "temp";
const char  hmit_topic[]  = "hmit";

const long interval = 8000;
unsigned long previous_millis = 0;

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
  mqtt_client.poll();

  unsigned long current_millis = millis();

  if (current_millis - previous_millis >= interval) {
    previous_millis = current_millis;

      float h = dht.readHumidity();
      float t = dht.readTemperature();
      float f = dht.readTemperature(true);

      if (isnan(h) || isnan(t) || isnan(f)) {
       Serial.println(F("Failed to read from DHT sensor!"));
       return;
      }

      Serial.print("Sending message to topic: ");
      Serial.println(temp_topic);
      Serial.println(f);

      Serial.print("Sending message to topic: ");
      Serial.println(hmit_topic);
      Serial.println(h);

      mqtt_client.beginMessage(temp_topic);
      mqtt_client.print(f);
      mqtt_client.endMessage();
      
      mqtt_client.beginMessage(hmit_topic);
      mqtt_client.print(h);
      mqtt_client.endMessage();

      Serial.println();
  }
}