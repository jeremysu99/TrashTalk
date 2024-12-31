# TrashTalk

## Overview
- Progressive Web App (PWA) aimed to streamline communication between housemates over trash disposal

- IoT-based Arduino R4 with ESP-32 WiFi module allows connection to Firebase, while ultraonic JSN-SR04T sensor and HX711 load cells are able to detect changes in trash level + weight and constantly update remote database

- When the sensors detect a filled trash bin, it notifies the application and sends a reminder to the current housemate's phone whose turn it is

- Taking out the trash resets the sensors, updates the app, and refreshes the cycle to uphold responsibility for all housemates
  
- Equipped with Firebase Realtime Database updating and wireless connection

- Deployed with Firebase Hosting
  
## Technologies Used
- Arduino IDE

- Firebase (Realtime Database, Authentication, Hosting)

- Express.js

- React

- Node.js

- Tailwind CSS

## Setup instructions
- Visit `https://trashtalk-453d2.web.app`
  
- Add page to home screen and enjoy!

- For hardware setup, please follow instructions in `firmware/README.md`
