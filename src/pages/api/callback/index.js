export default function handler({ query: { PaymentId } }, res) {
  const axios = require("axios");

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
  };

  const body = {
    POSKey: process.env.BARION_POS_KEY,
    PaymentId: PaymentId,
  };

  return axios
    .get(process.env.BARION_GET_PAYMENT_STATE_URL, body, {
      headers,
    })
    .then(async (res) => {
      res.status(200).json();
    });
}
