import Cors from "cors";

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
  })
);

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await cors(req, res);

      const response = fetch("https://sandbox.simplepay.hu/payment/v2/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Signature:
            "zXAB58TJdfpDaMa2rXUlefFYVlQQ91CXqot2Y6kcG79wMh55uv1hQphH9xt7qHFn",
        },
        body: JSON.stringify({
          salt: "126dac8a12693a6475c7c24143024ef8",
          merchant: "PUBLICTESTHUF",
          orderRef: "101010515680292482600",
          currency: "HUF",
          customerEmail: "sdk_test@otpmobil.com",
          language: "HU",
          sdkVersion:
            "SimplePayV2.1_Payment_PHP_SDK_2.0.7_190701:dd236896400d7463677a82a47f53e36e",
          methods: ["CARD"],
          total: "25",
          timeout: "2019-09-11T19:14:08+00:00",
          url: "https://sdk.simplepay.hu/back.php",
          invoice: {
            name: "SimplePay V2 Tester",
            company: "",
            country: "hu",
            state: "Budapest",
            city: "Budapest",
            zip: "1111",
            address: "Address 1",
            address2: "Address 2",
            phone: "06203164978",
          },
        }),
      })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((response) => console.log("Completed post request!", response))
        .catch((error) => console.log(error));

      return response;
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }
  //   else if (req.method === "GET") {
  //     try {
  //       const response = fetch("https://sandbox.simplepay.hu/payment/v2/start", {
  //         method: "GET",
  //         mode: "no-cors",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Accept-language": "en",
  //           Signature: "",
  //           // 'Content-Type': 'application/x-www-form-urlencoded',
  //         },
  //         body: JSON.stringify(res),
  //       })
  //         .then((response) => res.status(200).json({ res }))
  //         .then((response) => console.log("Completed get request!", response));

  //       return response;
  //     } catch (err) {
  //       console.error(`Error: ${err}`);
  //     }
  //   }
  else {
  }
}

export default handler;
