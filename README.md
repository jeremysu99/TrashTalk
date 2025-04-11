# TrashTalk

## Images and Demo
- [Link to YouTube Demo](https://youtu.be/QXoKqhBXq0M)

<img width="177" alt="image" src="https://github.com/user-attachments/assets/48120ae2-a1d5-471d-9f4a-0f1b32765978" />

<img width="177" alt="image" src="https://github.com/user-attachments/assets/a8507f01-7440-49ac-af9c-3d68b96ea978" />

<img width="177" alt="image" src="https://github.com/user-attachments/assets/81cd7bc7-4a43-4985-ada6-3a0ba07f51b1" />

<img width="177" alt="image" src="https://github.com/user-attachments/assets/234579e1-1392-4021-be8a-c0e6a432e2a0" />

<img width="177" alt="image" src="https://github.com/user-attachments/assets/7758d80c-7f11-4589-a626-1a4d69fdff00" />

<img width="177" alt="image" src="https://github.com/user-attachments/assets/df3ebcdd-0dfc-458d-83d4-7a98e7c6e291" />

<img width="177" alt="image" src="https://github.com/user-attachments/assets/6a46bc95-00c8-43e5-bd15-e1f3c5d250b4" />

## Overview
- Progressive Web App (PWA) aimed to streamline communication between housemates over trash disposal

- IoT-based Arduino R4 with ESP-32 WiFi module allows connection to Firebase, while ultraonic JSN-SR04T sensor and HX711 load cells are able to detect changes in trash level + weight and constantly update remote database

- When the sensors detect a filled trash bin, it notifies the application and sends a reminder to the current housemate's phone whose turn it is

- Taking out the trash resets the sensors, updates the app, and refreshes the cycle to uphold responsibility for all housemates
  
- Equipped with Firebase Realtime Database updating and wireless connection

- Deployed with Firebase Hosting
  
## Technologies Used
- Arduino IDE

- Firebase (Realtime Database, Authentication, Hosting, Cloud Functions)

- React

- Tailwind CSS

## Setup instructions
- clone the repository for project setup

- run `npm install` in `/app` directory to install necessary dependencies
  
- Visit `https://trashtalk-453d2.web.app`
  
- Add page to home screen and enjoy!

- For hardware setup, please follow instructions in `firmware/README.md`
