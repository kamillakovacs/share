import firebase from "firebase";

// if (!firebase.apps.length) {
//   firebase.initializeApp({
//     credential: firebase.credential.cert({
//       privateKey: serviceAccount.private_key,
//       clientEmail: serviceAccount.client_email,
//       projectId: serviceAccount.project_id,
//     }),
//     databaseURL: "https://sharespareservation.firebaseio.com",
//   });
// }

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
