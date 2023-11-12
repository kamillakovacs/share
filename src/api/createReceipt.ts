import axios from "axios";
import convert from 'xml-js';

import { ReceiptEmail } from "../lib/interfaces";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { sendReceipt } from "./sendReceipt";

export const createReceipt = async (reservation: ReservationWithDetails, title: string, email: ReceiptEmail) => {
    const price = parseInt(reservation.price)
    const tax = price * 0.05;
    const netPrice = price - tax;
    const receiptNumber = "NYGTA-" + new Date().getFullYear() + "-111";

    const data = JSON.stringify({
        "_declaration":{"_attributes":{"version":"1.0","encoding":"utf-8"}},
        "xmlnyugtacreate":{"_attributes":
            {
                "xmlns":"http://www.szamlazz.hu/xmlnyugtacreate",
                "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "https://www.szamlazz.hu/szamla/docs/xsds/nyugtacreate/xmlnyugtacreate.xsd",
            },
            "beallitasok": {
                "szamlaagentkulcs": process.env.SZAMLAZZ_SZAMLA_AGENT_KULCS,
                "pdfLetoltes": false
            }, 
            "fejlec": {
                "hivasAzonosito": reservation.firstName+reservation.lastName+reservation.transactionId,
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
    var xml = convert.json2xml(data, options);

    return axios.post("https://www.szamlazz.hu/szamla/", xml)
        .then(async (res: any) => {
            console.log(res)
            // queryReceipt(reservation, receiptNumber, email)
        });
}
