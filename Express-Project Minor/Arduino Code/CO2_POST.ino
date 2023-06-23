#include <Wire.h>
#include "WiFi.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

#include <Arduino.h>
#include "MHZ19.h" 
#include <SoftwareSerial.h>     // Remove if using HardwareSerial or non-uno library compatable device

#define RX_PIN 16                                         
#define TX_PIN 17                                          
#define BAUDRATE 9600 

MHZ19 myMHZ19;
SoftwareSerial mySerial(RX_PIN, TX_PIN);    // Uno example

//const char* ssid = "FRITZ!Box 7590 UI";
//const char* password = "82232465567575448540";

const char* ssid = "iPhone von Henrik";
const char* password = "17042001";
#define WIFI_TIMEOUT_MS 20000


void setup() {

Serial.begin(115200);

 Serial.print("Start with connecting:");
  WiFi.mode(WIFI_STA);
 WiFi.begin(ssid, password);

 unsigned long start = millis();

 while(WiFi.status() != WL_CONNECTED && millis() - start < WIFI_TIMEOUT_MS){
   Serial.println(WiFi.status());
   Serial.println("Connecting");
   delay(100);
 }

  if(WiFi.status() != WL_CONNECTED){
    Serial.print("Failed!");
    
  } else {
    Serial.print("Connected");
    Serial.print(WiFi.localIP());
  }

  mySerial.begin(BAUDRATE);    // sensor serial
    myMHZ19.begin(mySerial);     // pass to library

 }

void loop() { 

  printValues();
  delay(15000);
}

void printValues() {
        int CO2;
        CO2 = myMHZ19.getCO2();        
        
        Serial.print("CO2 (ppm): ");
        Serial.println(CO2);

   sendrequest(myMHZ19.getCO2());
  delay(15000);  // Wait for 5 seconds before sending the next request
}

void sendrequest(int co2){
  

//String payload = String("{\"carbon\":") + String(co2) + "}";

String payload = String("{\"carbon\":") + String(co2) + "}";

 HTTPClient http;
  http.begin("http://172.20.10.2:3001/carbon"); // Replace with your actual API endpoint

  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();

  delay(15000); 

}






