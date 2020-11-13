import * as firebaseAdmin from "firebase-admin";
import * as serviceAccount from "../../share-service-account.json";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
      projectId: serviceAccount.project_id,
    }),
    databaseURL: "https://sharespareservation.firebaseio.com",
  });
}

export default firebaseAdmin;
