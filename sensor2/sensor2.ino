#include "DHT.h"
#include <WiFiNINA.h>
#include <ArduinoMqttClient.h>
#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>

#define DHTPIN 2       // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11  // DHT 11
DHT dht(DHTPIN, DHTTYPE);

// Adapted From: https://docs.arduino.cc/tutorials/uno-wifi-rev2/uno-wifi-r2-mqtt-device-to-device

// Specify WiFi information
char ssid[] = "2.4 700 Markham Unit 103";
char pass[] = "CXNK0059767C";

//create a wifi client for PUT requests
WiFiSSLClient wifi_client;
//create a wifi client for MQTT
WiFiClient wifi_mqtt;
//create a mqtt client
MqttClient mqtt_client(wifi_mqtt);

// Specify MQTT information
const char broker[] = "192.168.10.33"; // <- update on new network
int mqttport = 1883;
const String sensor_topic = "sensors/63cb39de5209482dd6e98e9e/readings";
const bool mqttChoice = false;

// Specify server information
char server[] = "osuscc-testing.azurewebsites.net";
const int port = 443;
const String extendedUrl = "/api/homes/63c8a874922df840d1d7ec0f/" + sensor_topic;

//create a Http client for requests
HttpClient client = HttpClient(wifi_client, server, port);

// Message Interval
const long interval = 8000;
unsigned long previous_millis = 0;

void setup() {
  Serial.print(extendedUrl);
  // Wait for serial connection
  Serial.begin(9600);
  while (!Serial) {
    Serial.print("No Serial?");
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

  if (mqttChoice == true) {
    //connect to mqtt broker
    connectToMqttBroker();
  }   
}

void connectToMqttBroker() {
  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  // Wait for MQTT connection
  while (!mqtt_client.connect(broker, mqttport)) {
    // Re-attempt MQTT connection until MQTT connection astablished
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqtt_client.connectError());
    Serial.print("Re-attempting ...\n");
    delay(5000);    
  }
}

void httpRequest(float f, float t, float h) {
  //create json object
  const size_t capacity = JSON_OBJECT_SIZE(6);
  DynamicJsonDocument doc(capacity);
  //change float to string for request type
  String temp_f = String(f);
  String temp_c = String(t);
  String humidity = String(h, 2);
  //add readings to the json object
  doc["temp_f"] = temp_f;
  doc["temp_c"] = temp_c;
  doc["humidity"] = humidity;
  doc["date_time"] = "test";
  String json;
  serializeJson(doc, json);
  //create the request body
  String open = "[";
  String close = "]";
  String putData = "";
  putData += open;
  putData += json;
  putData += close;
  //Create PUT request
  Serial.println("making PUT request");
  String contentType = "application/json";
  client.put(extendedUrl, contentType, putData);
  //"/api/homes/63c8a874922df840d1d7ec0f/sensors/63cb39de5209482dd6e98e9e/readings"
  //get status code
  int statusCode = client.responseStatusCode();
  Serial.print("Status code: ");
  Serial.println(statusCode);
  //get response body
  String response = client.responseBody();
  Serial.print("Response: ");
  Serial.println(response);
  Serial.println(); 
}
void sendMqtt(float f, float t, float h) {

  if (isnan(h) || isnan(t) || isnan(f)) {
    // If pulling sensor data fails print an error message and send message to pi
    Serial.println(F("Failed to read from DHT sensor!"));

    mqtt_client.beginMessage(sensor_topic);
    mqtt_client.print("Failed to read from DHT sensor!");
    mqtt_client.endMessage();
  } else {
    mqtt_client.beginMessage(sensor_topic);
    mqtt_client.print(f);
    mqtt_client.print(",");
    mqtt_client.print(h);
    mqtt_client.print(",");
    mqtt_client.print(t);
    mqtt_client.endMessage();
  }
}
void loop() {
  unsigned long current_millis = millis();

  if (current_millis - previous_millis >= interval) {
    // If the current time matches the message interval
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    float f = dht.readTemperature(true);
    h = h/100;

    //Print Sensor Data
    Serial.println();
    Serial.print("temp_f: ");
    Serial.print(f);
    Serial.print(", ");
    Serial.print("humidity: ");
    Serial.print(h);
    Serial.print(", ");
    Serial.print("temp_c: ");
    Serial.print(t);
    Serial.println();

    if (isnan(h) || isnan(t) || isnan(f)) {
      // If pulling sensor data fails print an error message
      Serial.println(F("Failed to read from DHT sensor!"));
      previous_millis = current_millis;
      return;
    }
    if (mqttChoice == false) {
      httpRequest(f,t,h);
    } else {
      //if the connection to the mqtt broker has been lost try to connect again
      if (!mqtt_client.connect(broker, mqttport)) {
        connectToMqttBroker();
      }
      mqtt_client.poll();
      sendMqtt(f,t,h);
      Serial.println("Sent Sensor Readings To MQTT Broker");
    }
    // Update previous_millis
    previous_millis = current_millis;

  }
}