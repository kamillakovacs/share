import axios from "axios";
import convert from 'xml-js';

import { ReceiptEmail } from "../lib/interfaces";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { sendPaymentReceipt } from "./sendPaymentReceipt";

export const createPaymentReceipt = async (reservation: ReservationWithDetails, title: string, email: ReceiptEmail) => {
    const price = parseInt(reservation.price)
    const tax = price * 0.05;
    const netPrice = price - tax;
    const receiptNumber = "NYGTA-2017-111";

    const data = JSON.stringify({
        "_declaration":{"_attributes":{"version":"1.0","encoding":"utf-8"}},
        "xmlnyugtacreate":{"_attributes":
            {
                "xmlns":"http://www.szamlazz.hu/xmlnyugtacreate",
                "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "https://www.szamlazz.hu/szamla/docs/xsds/nyugtacreate/xmlnyugtacreate.xsd",
            },
            "beallitasok": {
                "szamlaagentkulcs": "In order to generate an Agent key, the owner or administrator of the account needs to login to the Szamlazz.hu website scroll down to the bottom of the dashboard. There's a section called Számla Agent kulcsok (= Számla Agent Keys), and you can generate a key by clicking the key button on the right side. The key is generated immediately and is ready to use. You can copy it directly by clicking the icon next to it.",
                "pdfLetoltes": false
            }, 
            "fejlec": {
                "hivasAzonosito": "You should use <hivasAzonosito/> in the posted XML to make the call fault tolerant. If this field is in use, it needs to be unique, otherwise the API call will be unsuccessful. This ensures that if the same XML is posted multiple times, it will not duplicate an existing receipt.",
                "elotag": receiptNumber,
                "fizmod": "barion",
                "penznem": "Ft"
            },
            "tetelek": {
                "tetel": {
                    "megnevezes": title,
                    "azonosito": "",
                    "mennyiseg": "1.0",
                    "mennyisegiEgyseg": "db",
                    "nettoEgysegar": netPrice,
                    "netto": netPrice,
                    "afakulcs": "5",
                    "afa": tax,
                    "brutto": reservation.price,
                    "fokonyv": {
                        "arbevetel": "",
                        "afa": ""
                    }
                }
            }
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
        // queryReceipt(reservation, receiptNumber, email)
    // });
}
