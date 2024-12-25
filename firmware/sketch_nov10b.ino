#include <WiFiS3.h>
#include <Arduino_JSON.h>
#include <Firebase.h>

#define TRIGPIN 11
#define ECHOPIN 10

#include <HX711_ADC.h>
#if defined(ESP8266)|| defined(ESP32) || defined(AVR)
#include <EEPROM.h>
#endif
// Set pin 7 to be 5V substitute
#define VCC2 7

HX711_ADC LoadCell(4,5);
const int calVal_eepromAdress = 0;
unsigned long t = 0;
unsigned long lastDistanceTime = 0;
unsigned long lastWeightTime = 0;
float totalWeight = 0;
float totalDistance = 0;
int weightCounts = 0;
int distanceCounts = 0;
bool isEmpty = true;

float duration, distance;
int currIndex, roomCount;
//const char* ssid = "RESNET-GUEST-DEVICE";
//const char* password = "ResnetConnect";
const char* ssid = "UCSD-GUEST";
const char* password = "";
const char* firebaseHost = "https://trashtalk-453d2-default-rtdb.firebaseio.com/";
const char* apiKey = "AIzaSyBkFUa3yHyKsXN30wkr217R5qM5_-msve8";
Firebase fb(firebaseHost, apiKey);

void setup() {
  // set up ultrasound sensor pins
  pinMode(ECHOPIN, INPUT);
  pinMode(TRIGPIN, OUTPUT);
  // set vcc2 to 5V
  pinMode(VCC2, OUTPUT);
  digitalWrite(VCC2, HIGH);

  Serial.begin(57600);
  LoadCell.begin();
  float calibrationValue; // calibration value (see example file "Calibration.ino")
  calibrationValue = 696.0; // uncomment this if you want to set the calibration value in the sketch
  #if defined(ESP8266)|| defined(ESP32)
    //EEPROM.begin(512); // uncomment this if you use ESP8266/ESP32 and want to fetch the calibration value from eeprom
  #endif
    //EEPROM.get(calVal_eepromAdress, calibrationValue); // uncomment this if you want to fetch the calibration value from eeprom

  unsigned long stabilizingtime = 2000; // preciscion right after power-up can be improved by adding a few seconds of stabilizing time
  boolean _tare = true; //set this to false if you don't want tare to be performed in the next step
  LoadCell.start(stabilizingtime, _tare);
  if (LoadCell.getTareTimeoutFlag()) {
    Serial.println("Timeout, check MCU>HX711 wiring and pin designations");
    while (1);
  }
  else {
    LoadCell.setCalFactor(calibrationValue); // set calibration value (float)
    Serial.println("Startup is complete");
  }

  // Set up WiFi and Firebase
  while (!Serial);

  // Start connecting to Wi-Fi
  Serial.println("Connecting to Wi-Fi...");
  //WiFi.begin(ssid, password);
  WiFi.begin(ssid);
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  // Print connection status and IP address
  Serial.println("\nConnected to Wi-Fi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Connected to Firebase!\n");
}

void loop() {
  // update weight sensors
  static boolean newDataReady = 0;
  const int serialPrintInterval = 100; //increase value to slow down serial print activity

  // check for new data/start next conversion:
  if (LoadCell.update()) newDataReady = true;

  // get smoothed value from the dataset:
  if (newDataReady) {
    if (millis() > t + serialPrintInterval) {
      float i = LoadCell.getData();
      t = millis();
      float averageWeight = totalWeight / weightCounts;
      if (t > lastWeightTime + 20000) {
        fb.setFloat("households/98WD71/weight", averageWeight);
        totalWeight = 0;
        weightCounts = 1;
        Serial.println("Updated weight");
        lastWeightTime = t;
      }
      else{
        totalWeight += i;
        weightCounts += 1;
      }
      Serial.print("Average weight: ");
      Serial.println(totalWeight / weightCounts);
      newDataReady = 0;
    }
  }

  // receive command from serial terminal, send 't' to initiate tare operation:
  if (Serial.available() > 0) {
    char inByte = Serial.read();
    if (inByte == 't') LoadCell.tareNoDelay();
  }

  // check if last tare operation is complete:
  if (LoadCell.getTareStatus() == true) {
    Serial.println("Tare complete");
  }

  // update ultrasonic sensor
  digitalWrite(TRIGPIN, LOW);
  delayMicroseconds(20);

  digitalWrite(TRIGPIN, HIGH);
  delayMicroseconds(40);

  digitalWrite(TRIGPIN, LOW);

  // Calculate distance between sensor and surface
  duration = pulseIn(ECHOPIN, HIGH);

  distance = (duration / 2) * 0.343;
  float averageDistance = totalDistance / distanceCounts;

  if (isEmpty){
    if (averageDistance < 300 && millis() - lastDistanceTime > 20000){
      currIndex = fb.getInt("households/98WD71/currTrashIndex");
      roomCount = fb.getInt("households/98WD71/numberOfPeople");
      fb.setFloat("households/98WD71/trashLevel", averageDistance);
      totalDistance = 0;
      distance = 1;
      isEmpty = false;
      Serial.println("Trash full. Please take out the trash.");
    }
    else{
      totalDistance += distance;
      distanceCounts += 1;
      lastDistanceTime = millis();
    }
  }
  else{
    if (averageDistance > 700 && millis() - lastDistanceTime > 20000){
      // Change person whose turn it is
      fb.setInt("households/98WD71/currTrashIndex", (currIndex + 1) % roomCount);
      totalDistance = 0;
      distance = 1;
      isEmpty = false;
      isEmpty = true;
      Serial.println("Trash emptied. Now moving trash duty.");
    }
    else{
      totalDistance += distance;
      distanceCounts += 1;
      lastDistanceTime = millis();
    }
  }
  Serial.println("Average Distance: ");
  Serial.print(totalDistance / distanceCounts);
  Serial.println(" mm");
  delay(1000);
}
