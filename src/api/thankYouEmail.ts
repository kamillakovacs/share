import formData from "form-data";
import Mailgun from "mailgun.js";
// import mailchimp from "@mailchimp/mailchimp_marketing";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY });

// export const sendThankYouEmail = ({ name, date, dateOfPurchase, numberOfTubs, totalPrice }) => {
//   mailchimp.setConfig({
//     apiKey: process.env.MAILCHIMP_API_KEY
//     server: "us19"
//   });

//   const callPing = async () => {
//     const response = await mailchimp.ping.get();
//     console.log(response);
//   };

//   callPing();
// };

export const sendThankYouEmail = ({ name, date, dateOfPurchase, numberOfTubs, totalPrice }) =>
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
        totalPrice
      })
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.error(err)); // logs any error
