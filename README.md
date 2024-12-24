# TrashTalk

## Overview
- Web application with mobile compatibility through aimed to streamline communication between housemates over trash disposal

- IoT-based Arduino R4 with ESP-32 WiFi module allows connection to Firebase, while ultraonic JSN-SR04T sensor and HX711 weight sensor are able to detect changes in trash level + weight and constantly update remote database

- When the sensors detect a filled trash bin, it notifies the application and sends a reminder to the current housemate's phone whose turn it is

- Taking out the trash resets the sensors, updates the app, and refreshes the cycle to uphold responsibility for all housemates
  
- Equipped with Firebase Realtime Database updating and wireless connection
  
## Technologies Used
- Arduino IDE

- Firebase

- Express.js

- React.js

- Node.js

## Setup instructions
- Clone the repository
  
- Connect to the Firebase Realtime Database
