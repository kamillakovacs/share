import axios from "axios";
import convert from 'xml-js';

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { ReceiptEmail } from "../lib/interfaces";

export const queryReceipt = async (reservation: ReservationWithDetails, receiptNumber: string, email: ReceiptEmail) => {
    const data = JSON.stringify({
        "_declaration":{"_attributes":{"version":"1.0","encoding":"utf-8"}},
        "xmlnyugtasend":{"_attributes":
            {
                "xmlns":"http://www.szamlazz.hu/xmlnyugtaget",
                "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.szamlazz.hu/xmlnyugtaget http://www.szamlazz.hu/docs/xsds/nyugtaget/xmlnyugtaget.xsd",
            },
            "beallitasok": {
                "szamlaagentkulcs": "In order to generate an Agent key, the owner or administrator of the account needs to login to the Szamlazz.hu website scroll down to the bottom of the dashboard. There's a section called Számla Agent kulcsok (= Számla Agent Keys), and you can generate a key by clicking the key button on the right side. The key is generated immediately and is ready to use. You can copy it directly by clicking the icon next to it.",
                "pdfLetoltes": false
            }, 
            "fejlec": {
                "nyugtaszam": receiptNumber
            },
        }
    })

    var options = {compact: true, ignoreComment: true, spaces: 4};
    var result = convert.json2xml(data, options);
    console.log(result);
    const headers = {
        "Content-Type": "text/html"
      };

    // return axios
    // .post("https://www.szamlazz.hu/szamla/", data, {
    //   headers
    // })
    // .then(async (res: any) => {
        // sendPaymentReceipt(reservation, receiptNumber, email)
    // });
}