const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Firebase Admin Setup
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://trashtalk-453d2-default-rtdb.firebaseio.com"
});

const db = firebase.database();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
