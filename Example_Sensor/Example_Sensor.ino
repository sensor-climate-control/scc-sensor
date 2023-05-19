#include "DHT.h"
#include <WiFiNINA.h>
#include <ArduinoMqttClient.h>
#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>
#include "arduino_secrets.h"

#define DHTPIN 2       // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11  // DHT 11
DHT dht(DHTPIN, DHTTYPE);

// Adapted From: https://docs.arduino.cc/tutorials/uno-wifi-rev2/uno-wifi-r2-mqtt-device-to-device

// Specify WiFi information
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

//create a wifi client for PUT requests
WiFiSSLClient wifi_client;
//create a wifi client for MQTT
WiFiClient wifi_mqtt;
//create a mqtt client
MqttClient mqtt_client(wifi_mqtt);

// Specify MQTT information
const char broker[] = SECRET_BROKER; // <- update on new network
int mqttport = 1883;
const String sensor_topic = SECRET_SENSORTOPIC;

// Specify Mqtt or Http direct choice
const String method = SECRET_METHOD;

// Specifiy token if http choice is used
const String bearerToken = SECRET_TOKEN;
// Specify server information
char server[] = SECRET_SERVER;
const int port = 443;
const String extendedUrl = SECRET_HOMEURL + sensor_topic;
// Create a Http client for requests
HttpClient client = HttpClient(wifi_client, server, port);

// Message Interval
const long interval = 8000;
unsigned long previous_millis = 0;

void setup() {
  Serial.print(extendedUrl);
  // Wait for serial connection
  Serial.begin(9600);

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

  if (method == "mqtt") {
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
  //doc["date_time"] = "test";
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
  //Serial.println(putData);
  String contentType = "application/json";
  client.beginRequest();
  client.put(extendedUrl);
  client.sendHeader(HTTP_HEADER_CONTENT_TYPE, contentType);
  client.sendHeader(HTTP_HEADER_CONTENT_LENGTH, putData.length());
  client.sendHeader("Authorization", bearerToken);
  client.beginBody();
  client.print(putData);
  client.endRequest();
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

    mqtt_client.beginMessage(extendedUrl);
    mqtt_client.print("Failed to read from DHT sensor!");
    mqtt_client.endMessage();
  } else {
    mqtt_client.beginMessage(extendedUrl);
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

  if (current_millis - previous_millis >= interval || previous_millis == 0) {
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
    int status;
    status = WiFi.status();
    if (status==WL_DISCONNECTED || status==WL_CONNECTION_LOST) {
      Serial.print("WiFi Connection Lost Attempting to Reconnect:");
      while (status != WL_CONNECTED) {
        status = WiFi.begin(ssid, pass);
        Serial.print(".");
        delay(10000);
      }
    }
    if (isnan(h) || isnan(t) || isnan(f)) {
      // If pulling sensor data fails print an error message
      Serial.println(F("Failed to read from DHT sensor!"));
      previous_millis = current_millis;
      return;
    }

    if (method == "http") {
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
