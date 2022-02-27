export default function handler(req, res) {
  const firebase = require("../../../lib/firebase").default;
  const { reservationData, newCustomer, paymentId, customerAlreadyInDatabase } = req.body;

  const database = firebase.database();
  const customers = database.ref("customers");
  const reservations = database.ref("reservations");
  const newCustomerId = customers.child("customers").push().key;

  reservations.update({
    [paymentId]: reservationData,
  });

  if (!customerAlreadyInDatabase) {
    customers.update({
      [newCustomerId]: newCustomer,
    });
  }

  return res.status(200).json({ success: true });
}
