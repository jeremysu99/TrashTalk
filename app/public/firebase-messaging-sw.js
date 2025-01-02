// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');


firebase.initializeApp({
      apiKey: "AIzaSyBkFUa3yHyKsXN30wkr217R5qM5_-msve8",
      authDomain: "trashtalk-453d2.firebaseapp.com",
      databaseURL: "https://trashtalk-453d2-default-rtdb.firebaseio.com",
      projectId: "trashtalk-453d2",
      storageBucket: "trashtalk-453d2.firebasestorage.app",
      messagingSenderId: "948007141722",
      appId: "1:948007141722:web:00243368a7469951583363",
      measurementId: "G-EDHLKZER11"
});

// Initialize Firebase
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});