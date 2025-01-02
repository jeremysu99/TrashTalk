/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

const corsHandler = cors({ origin: true });

admin.initializeApp();
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.sendNotification = functions.https.onRequest((req, res) => {
    corsHandler(req, res, () => {
      // Your function logic here
      const fcmToken = req.body.fcmToken;
      const title = req.body.title;
      const body = req.body.body;
  
      // Send notification
      const message = {
        notification: {
          title: title,
          body: body,
        },
        token: fcmToken,
      };
  
      admin
        .messaging()
        .send(message)
        .then((response) => {
        // Success response in JSON format
        res.status(200).json({
            success: true,
            message: "Notification sent successfully.",
            response: response, // Optionally include the Firebase response
        });
        })
        .catch((error) => {
        // Error response in JSON format
        res.status(500).json({
            success: false,
            message: "Error sending notification.",
            error: error.message, // Include the error message
        });
        });
    });
  });
