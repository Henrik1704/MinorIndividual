#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME680.h>
#include "WiFi.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

//const char* ssid = "FRITZ!Box 7590 UI";
//const char* password = "82232465567575448540";
#define WIFI_TIMEOUT_MS 20000

const char* ssid = "iPhone von Henrik";
const char* password = "17042001";


#define I2C_SDA 21
#define I2C_SCL 22

#define SEALEVELPRESSURE_HPA (1013.25)

TwoWire I2CBME = TwoWire(0);
Adafruit_BME680 bme;

unsigned long delayTime;

void setup() {

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

  Serial.begin(115200);
  Serial.println(F("BME680 test"));
  I2CBME.begin(I2C_SDA, I2C_SCL, 100000);

  bool status;

  // default settings
  // (you can also pass in a Wire library object like &Wire2)
  status = bme.begin(0x77, &I2CBME);  
  if (!status) {
    Serial.println("Could not find a valid BME680 sensor, check wiring!");
    while (1);

  }

  Serial.println("-- Default Test --");
  delayTime = 15000;

 }

void loop() { 

  printValues();
  delay(delayTime);
}

void printValues() {
  Serial.println(WiFi.localIP());
  Serial.print("Temperature = ");
  Serial.print(bme.readTemperature());
  Serial.println(" *C");

  Serial.print("Humidity = ");
  Serial.print(bme.readHumidity());
  Serial.println(" %");

  sendrequest(bme.readTemperature(), bme.readHumidity());

   
  delay(15000);  // Wait for 5 seconds before sending the next request
}

void sendrequest(float temperature, float humidity){
  // Create JSON payload

  
//String jsonBody = "{\"temperature\": + String(temperature) + ", \"humidity\": 1 }";




String payload = String("{\"temperature\":") + String(temperature) + ", \"humidity\":" + String(humidity) + "}";


//String requestBody = "temperature=" + String(temperature) + "&humidity=" + String(humidity);

 HTTPClient http;
  http.begin("http://172.20.10.2:3001/bme"); // Replace with your actual API endpoint

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






