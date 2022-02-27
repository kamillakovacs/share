import * as firebase from "firebase-admin";
import crypto from "crypto";
import service from "../../service-account.enc";

const algorithm = "aes-128-cbc";
const decipher = crypto.createDecipheriv(
  algorithm,
  process.env.SERVICE_ENCRYPTION_KEY,
  process.env.SERVICE_ENCRYPTION_IV
);
let decrypted = decipher.update(service.encrypted, "base64", "utf8");
decrypted += decipher.final("utf8");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  credential: firebase.credential.cert(JSON.parse(decrypted)),
  databaseAuthVariableOverride: {
    uid: "share-service-worker",
  },
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
