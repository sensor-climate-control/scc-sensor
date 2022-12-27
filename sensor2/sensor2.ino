#include "DHT.h"
#include <WiFiNINA.h>
#include <ArduinoMqttClient.h>
//#include <SPI.h>
//#include <MQTTPubSubClient_Generic.h>
//#include <PubSubClient.h>

#define DHTPIN 2       // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11  // DHT 11
DHT dht(DHTPIN, DHTTYPE);

// Adapted From: https://docs.arduino.cc/tutorials/uno-wifi-rev2/uno-wifi-r2-mqtt-device-to-device

// Specify WiFi information
char ssid[] = "Redfernj";
char pass[] = "00226573";

WiFiClient wifi_client;
MqttClient mqtt_client(wifi_client);

// Specify MQTT information
const char broker[] = "192.168.10.17";
int port = 1883;
const char temp_topic[] = "temp";
const char hmit_topic[] = "hmit";

// Message Interval
const long interval = 8000;
unsigned long previous_millis = 0;

int count = 0;

void setup() {

  // Wait for serial connection
  Serial.begin(9600);
  while (!Serial) {
    ;
  }

  // Wait for internet connection
  Serial.print("Attempting to connect to WPA SSID: ");
  Serial.println(ssid);

  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    // Re-attempt internet connection until internet connection astablished
    Serial.print(".");
    delay(5000);
  }

  Serial.println("You're connected to the network");
  Serial.println();

  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  // Wait for MQTT connection
  while (!mqtt_client.connect(broker, port)) {
    // Re-attempt MQTT connection until MQTT connection astablished
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqtt_client.connectError());

    Serial.print("Re-attempting ...\n");
    delay(5000);
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();
}

void loop() {
  mqtt_client.poll();

  unsigned long current_millis = millis();

  if (current_millis - previous_millis >= interval) {
    // If the current time matches the message interval

    // Update previous_millis
    previous_millis = current_millis;

    // Pull data from sensor
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    float f = dht.readTemperature(true);

    if (isnan(h) || isnan(t) || isnan(f)) {
      // If pulling sensor data fails print an error message
      Serial.println(F("Failed to read from DHT sensor!"));
      return;
    }

    // Print sensor data
    Serial.print("Sending message to topic: ");
    Serial.println("sensor2/temp ");
    Serial.println(f);

    Serial.print("Sending message to topic: ");
    Serial.println("sensor2/hmit ");
    Serial.println(h);

    // Send sensor data to MQTT broker
    mqtt_client.beginMessage("sensor2/temp ");
    mqtt_client.print(f);
    mqtt_client.endMessage();

    mqtt_client.beginMessage("sensor2/hmit ");
    mqtt_client.print(h);
    mqtt_client.endMessage();

    Serial.println();
  }
}