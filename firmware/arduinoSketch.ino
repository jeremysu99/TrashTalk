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
  totalWeight = 0;
  totalDistance = 0;
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
  /*
   First we deal with the weight sensors. Read in the value from the load cells to get the new data
   and keep a running average of 20 seconds. Also input a 't' to tare the operation.
   */
  static boolean newDataReady = 0;
  const int serialPrintInterval = 100; //increase value to slow down serial print activity

  // check for new data/start next conversion:
  if (LoadCell.update()) newDataReady = true;

  // get smoothed value from the dataset:
  if (newDataReady) {
    float i = LoadCell.getData() / 3;
    t = millis();
    float averageWeight = totalWeight / weightCounts;
    // Round averageWeight to the tenths place
    averageWeight = round(averageWeight * 10) / 10.0;
    if (averageWeight < 0){
      averageWeight *= -1;
    }
    // Every 20 seconds update the average weight
    if (t > lastWeightTime + 15000) {
      fb.setFloat("households/98WD71/trashWeight", averageWeight);
      totalWeight = 0;
      weightCounts = 1;
      Serial.println("Updated weight - new cycle starting");
      lastWeightTime = t;
    }
    else{
      totalWeight += i;
      weightCounts += 1;
    }
    Serial.print("Average weight: ");
    Serial.println(averageWeight);
    newDataReady = 0;
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
  /*
   Now we deal with the ultrasonic sensor. Acquire the data read from the sensor and, like
   with weight, keep a 20 second running average to update the database with.
   */
  // Read in data from trigpin
  digitalWrite(TRIGPIN, LOW);
  delayMicroseconds(20);

  digitalWrite(TRIGPIN, HIGH);
  delayMicroseconds(40);

  digitalWrite(TRIGPIN, LOW);

  // Calculate distance (mm) between sensor and surface with speed of sound
  duration = pulseIn(ECHOPIN, HIGH);
  distance = (duration / 2) * 0.343;
  if (distance > 1000){
    distance = 1000;
  }
  int averageDistance = totalDistance / distanceCounts;
  if (millis() > lastDistanceTime + 15000){
    currIndex = fb.getInt("households/98WD71/currTrashIndex");
    fb.setInt("households/98WD71/trashLevel", averageDistance);
    Serial.println("Updated distance - new cycle starting");
    totalDistance = distance;
    distanceCounts = 1;
    lastDistanceTime = millis();
  }
  else{
    totalDistance += distance;
    distanceCounts += 1;
  }
  Serial.println("Average Distance: ");
  Serial.print(averageDistance);
  Serial.println(" mm");
  delay(100);
}
