import axios from 'axios'
import { FC, FormEvent, memo } from 'react'
import { json2xml } from 'xml-js';

const Receipt: FC = () => {
    const xml = '<?xml version="1.0" encoding="utf-8"?>' +
        '<xmlnyugtacreate xmlns="http://www.szamlazz.hu/xmlnyugtacreate" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://www.szamlazz.hu/szamla/docs/xsds/nyugtacreate/xmlnyugtacreate.xsd">' +
        '<beallitasok><pdfLetoltes>false</pdfLetoltes></beallitasok>' +
        '<fejlec><hivasAzonosito>KamiKovacsdb18ac023b40ee118bf8001dd8b71cc5</hivasAzonosito><elotag>NYGTA-2023-111</elotag><fizmod>barion</fizmod><penznem>Ft</penznem></fejlec>' +
        '<tetelek><tetel>' +
        '<megnevezes>Craft Beer Spa nyugta</megnevezes><azonosito/><mennyiseg>1.0</mennyiseg><mennyisegiEgyseg>db</mennyisegiEgyseg><nettoEgysegar>20900</nettoEgysegar><netto>20900</netto><afakulcs>5</afakulcs><afa>1100</afa><brutto>22000</brutto><fokonyv><arbevetel/><afa/></fokonyv>' +
        '</tetel></tetelek>' +
        '</xmlnyugtacreate>';

    const data = JSON.stringify({
        "_declaration": { "_attributes": { "version": "1.0", "encoding": "utf-8" } },
        "xmlnyugtacreate": {
            "_attributes":
            {
                "xmlns": "http://www.szamlazz.hu/xmlnyugtacreate",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "https://www.szamlazz.hu/szamla/docs/xsds/nyugtacreate/xmlnyugtacreate.xsd",
            },
            "beallitasok": {
                "szamlaagentkulcs": process.env.SZAMLAZZ_SZAMLA_AGENT_KULCS,
                "pdfLetoltes": false
            },
            "fejlec": {
                "hivasAzonosito": "",
                "elotag": "receiptNumber",
                "fizmod": "barion",
                "penznem": "Ft"
            },
            "tetelek": {
                "tetel": {
                    "megnevezes": "title",
                    "azonosito": "",
                    "mennyiseg": "1.0",
                    "mennyisegiEgyseg": "db",
                    "nettoEgysegar": "netPrice",
                    "netto": "netPrice",
                    "afakulcs": "5",
                    "afa": "tax",
                    "brutto": "reservation.price",
                    "fokonyv": {
                        "arbevetel": "",
                        "afa": ""
                    }
                }
            }
        }
    })
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        console.log(event)
        // // const parser = new DOMParser();
        // // const xmlDoc = parser.parseFromString(xml, "text/xml"); 
        // // const formData = new FormData(event.target)
        // // const response = await axios.post('https://www.szamlazz.hu/szamla/', {
        // //   method: 'POST',
        // //   body: formData,
        // // })

        // // Handle response if necessary
        // console.log(response)
        // // ...
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="file" name="action-szamla_agent_nyugta_create" />
            <input type="submit" name="generate" value="Create receipt" />
            <textarea>{xml}</textarea>
        </form>
    )
}

export default memo(Receipt);