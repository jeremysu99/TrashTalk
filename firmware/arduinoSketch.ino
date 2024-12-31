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

const houseCode = "98WD71" // CHANGE AS NECESSARY

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
  // set vcc2 to 5V pin
  pinMode(VCC2, OUTPUT);
  digitalWrite(VCC2, HIGH);

  Serial.begin(57600);
  LoadCell.begin();
  float calibrationValue;
  calibrationValue = 696.0;

  unsigned long stabilizingtime = 2000;
  boolean _tare = true;
  LoadCell.start(stabilizingtime, _tare);
  if (LoadCell.getTareTimeoutFlag()) {
    Serial.println("Timeout, check MCU>HX711 wiring and pin designations");
    while (1);
  }
  else {
    LoadCell.setCalFactor(calibrationValue); // set calibration value (float)
    Serial.println("Startup is complete");
  }

  // Set up Serial
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
    if (millis() > t + serialPrintInterval) {
      float i = LoadCell.getData();
      t = millis();
      float averageWeight = totalWeight / weightCounts;
      // Every 20 seconds update the average weight
      if (t > lastWeightTime + 20000) {
        fb.setFloat("households/", houseCode, "/trashWeight", averageWeight);
        totalWeight = i;
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

  float averageDistance = totalDistance / distanceCounts;

  if (millis() > lastDistanceTime + 20000){
    currIndex = fb.getInt("households/", houseCode, "/currTrashIndex");
    roomCount = fb.getInt("households/", houseCode, "/numberOfPeople");
    fb.setFloat("households/", houseCode, "/trashLevel", averageDistance);
    totalDistance = distance;
    distanceCounts = 1;
  }
  else{
    totalDistance += distance;
    distanceCounts += 1;
    lastDistanceTime = millis();
  }
  Serial.println("Average Distance: ");
  Serial.print(totalDistance / distanceCounts);
  Serial.println(" mm");
  delay(1000);
}