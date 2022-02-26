import * as firebase from "firebase-admin";

// Fetch the service account key JSON file contents
var serviceAccount = require("../../service-account.json");
// Initialize the app with a service account, granting admin privileges
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
  credential: firebase.credential.cert(serviceAccount),
  databaseAuthVariableOverride: {
    uid: "share-service-worker",
  },
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
