import firebase from "firebase-admin";
import serviceAccount from "../service-account.json";

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
      projectId: serviceAccount.project_id,
    }),
    databaseURL: "https://sharespareservation.firebaseio.com",
  });
}

export default firebase;
