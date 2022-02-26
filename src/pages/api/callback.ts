export default function handler(req, res) {
  const axios = require("axios");

  res.status(200).json({ name: "John Doe" });

  // const headers = {
  //   "Content-Type": "application/json; charset=utf-8",
  // };

  // const body = {
  //   POSKey: "",
  //   PaymentId: "",
  // };

  // return axios
  //   .post(process.env.BARION_GET_PAYMENT_STATE_URL, body, {
  //     headers,
  //   })
  //   .then(async (res: any) => {});
}
