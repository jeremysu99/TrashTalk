import { database } from '../../app/src/firebase.js'
import { ref, set } from 'firebase/database'
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

function writeUserData(name, password, email){
    set(ref(database, 'users/' + email), {
        name: name,
        password: password,
        email: email,
    });
}

writeUserData("Jeremy", "123456", "jeremysu99gmail.com");
