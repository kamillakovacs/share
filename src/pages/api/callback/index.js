export default function handler(req, res) {
  const axios = require("axios");

  console.log(req.query);
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
  };

  const body = {
    POSKey: process.env.BARION_POS_KEY,
    PaymentId: req.query.paymentId,
  };

  return axios
    .post(process.env.BARION_GET_PAYMENT_STATE_URL, body, {
      headers,
    })
    .then(async (res) => {
      res.status(200).json();
    });
}
