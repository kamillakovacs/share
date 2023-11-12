import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY });

export const sendThankYouEmail = ({ name, date, dateOfPurchase, numberOfTubs, totalPrice, paymentId }) =>
  mg.messages
    .create(process.env.MAILGUN_DOMAIN, {
      from: `Mailgun Sandbox <${process.env.MAILGUN_EMAIL_ADDRESS}>`,
      to: "kamilla525@yahoo.com",
      subject: "Your Share Spa reservation",
      template: "thankyou",
      "h:X-Mailgun-Variables": JSON.stringify({
        name,
        date,
        dateOfPurchase,
        numberOfTubs,
        totalPrice,
        paymentId
      })
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.error(err)); // logs any error
