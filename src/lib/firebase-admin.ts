import * as firebaseAdmin from "firebase-admin";
import * as serviceAccount from "../../share-service-account.json";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: process.env.PRIVATE_KEY,
      clientEmail: process.env.CLIENT_EMAIL,
      projectId: process.env.PROJECT_ID,
    }),
    databaseURL: "https://sharespareservation.firebaseio.com",
  });
}

export default firebaseAdmin;
