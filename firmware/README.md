# Firmware Setup

## Required Components:
- Arduino ESP32 WiFi Board (Rev4 Preferred)

- Ultrasonic Sensor JSN-SR04T

- 4x Load Cells HX711

## Setup
- Follow [video instructions](https://www.youtube.com/watch?v=LIuf2egMioA&t=354s&pp=ygUQbG9hZCBjZWxscyBoeDcxMQ%3D%3D) to create load cell circuit:


- Connect ultrasonic sensor and load cell circuit wires to board

- Change house code to current house code within `arduinoSketch.ino` file

- Change WiFi name and passcode (leave as empty string if none) within the `arduinoSketch.ino` file

- Use Arduino IDE to upload microcontroller code to Arduino

- Mount components onto trashcan

- Power Arduino via USB-C connector to begin
