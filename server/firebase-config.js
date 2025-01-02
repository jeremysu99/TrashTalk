const express = require('express');
const app = express();
const firebase = require('@firebase/app').firebase;
const admin = require('firebase-admin');
const port = process.env.PORT || 4000;

require('dotenv').config();


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Function to send a notification
const sendNotification = async (fcmToken, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: fcmToken, // Target device FCM token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
