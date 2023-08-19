import axios from "axios";

export const useSendPaymentReceiptRequest = async (
    
  ) => {
    const headers = {
      "Content-Type": "application/json"
    };

    const data = {}

    return axios
    .post("https://www.szamlazz.hu/szamla/", data, {
      headers
    })
    .then(async (res: any) => {
      
    });

}