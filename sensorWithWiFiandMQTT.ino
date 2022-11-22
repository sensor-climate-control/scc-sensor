#include "DHT.h"
#include <SPI.h>
#include <WiFiNINA.h>
#include <PubSubClient.h>
#define DHTPIN 2     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11   // DHT 11

//replace with network login info
char ssid[] = "ssid";       
char pass[] = "pass";

//WiFiSSLClient client;

const char* mqtt_server = "ip"; //change to ip of rasp broker

WiFiClient rp2040Client;
PubSubClient client(rp2040Client);
long lastMsg = 0;
char msg[50];
int value = 0;

DHT dht(DHTPIN, DHTTYPE);

char *dtostrf (double val, signed char width, unsigned char prec, char *sout) {
  char fmt[20];
  sprintf(fmt, "%%%d.%df", width, prec);
  sprintf(sout, fmt, val);
  return sout;
}

void connectToAP() {
  // Connect to Wifi Access Point
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    
    // Connect to WPA/WPA2 network
    WiFi.begin(ssid, pass);
 
    // wait 1 second for connection:
    delay(1000);
    Serial.println("Connected...");
  }
}

void setup() {
  Serial.begin(9600);
    if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("WiFi module failed!");
    while (true);
  }
  connectToAP();
  client.setServer(mqtt_server, 1883);
  //client.setCallback(callback); 
  dht.begin();
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("RP2040Client")) {
      Serial.println("connected");
      // Subscribe
      client.subscribe("rp2040connect/output");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  delay(2000);
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float f = dht.readTemperature(true);
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
  float hif = dht.computeHeatIndex(f, h);
  float hic = dht.computeHeatIndex(t, h, false);

  Serial.print(F(" Humidity: "));
  Serial.print(h);
  char humString[8];
  dtostrf(h, 1, 2, humString);
  client.publish("rp2040connect/humidity", humString);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  char tempString[8];
  dtostrf(t, 1, 2, tempString);
  client.publish("rp2040connect/temperature", tempString);
  Serial.print(F("C "));
  Serial.print(f);
  Serial.print(F("F  Heat index: "));
  Serial.print(hic);
  Serial.print(F("C "));
  Serial.print(hif);
  char hifString[8];
  dtostrf(hif, 1, 2, hifString);
  client.publish("rp2040connect/heatIndex", hifString);
  Serial.println(F("F"));
}