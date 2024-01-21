const firebase = require("../../lib/firebase").default;
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { NextApiRequest, NextApiResponse } from "next";

import { ReservationWithDetails } from "../../lib/validation/validationInterfaces";
import { Action } from "../../lib/interfaces";
import { currencyFormat } from "../../lib/util/currencyFormat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { reservation, paymentId, language, action, date } = req.body;
    const database = firebase.database();
    const reservations = database.ref("reservations");
    const isHungarian = language === "hu-HU";

    const mailerSend = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY });
    const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL, "Craft Beer Spa");
    const recipients = [new Recipient(reservation.email, `${reservation.firstName} ${reservation.lastName}`)];
    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(getSubject(isHungarian, action))
        .setTemplateId(isHungarian ?
            process.env.MAILERSEND_CONFIRMATION_TEMPLATE_ID_HUNGARIAN :
            process.env.MAILERSEND_CONFIRMATION_TEMPLATE_ID_ENGLISH)
        .setPersonalization(getPersonalization(reservation, action))
        .setVariables(getVariables(reservation, language, paymentId, action, date));

    await mailerSend.email.send(emailParams)
        .then(async () => await reservations.update({
            [`${paymentId}/communication/reservationEmailSent`]: true
        }))
        .catch(e => console.log(e));

    return res.status(200).json({ success: true });
}

const getSubject = (isHungarian: boolean, action: Action) => {
    switch (action) {
        case Action.None:
        default:
            return isHungarian ?
                "Craft Beer Spa foglalás" :
                "Your Craft Beer Spa reservation"
        case Action.Change:
            return isHungarian ?
                "Craft Beer Spa foglalás módosítása" :
                "Your Craft Beer Spa reservation update"
        case Action.Cancel:
            return isHungarian ?
                "Craft Beer Spa foglalás lemondása" :
                "Your Craft Beer Spa reservation cancelation"
    }
}

const getPersonalization = (reservation: ReservationWithDetails, action: Action) => [
    {
        "email": reservation.email,
        "data": {
            "canceled": action === Action.Cancel ? true : false
        }
    }
]

const getVariables = (
    reservation: ReservationWithDetails,
    language: string,
    paymentId: string,
    action: Action,
    amendedDate?: Date
) => {
    const date = new Intl.DateTimeFormat(language, {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(amendedDate ? amendedDate : reservation?.date))

    const dateOfPurchase = new Intl.DateTimeFormat(language, {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(reservation?.dateOfPurchase))

    return [
        {
            "email": reservation.email,
            "substitutions": [
                {
                    "var": "firstName",
                    "value": reservation.firstName
                },
                {
                    "var": "lastName",
                    "value": reservation.lastName
                },
                {
                    "var": "date",
                    "value": date
                },
                {
                    "var": "tubsAndGuests",
                    "value": language === "hu-HU" ?
                        `${reservation.numberOfTubs.value} kád ${reservation.numberOfGuests.value} vendég számára` :
                        `${reservation.numberOfTubs.value} tubs for ${reservation.numberOfGuests.value} guests`,
                },
                {
                    "var": "dateOfPurchase",
                    "value": dateOfPurchase
                },
                {
                    "var": "netPrice",
                    "value": currencyFormat.format(parseFloat(reservation.price))
                },
                {
                    "var": "tax",
                    "value": currencyFormat.format(parseFloat(reservation.price))
                },
                {
                    "var": "totalPrice",
                    "value": currencyFormat.format(parseFloat(reservation.price))
                },
                {
                    "var": "url",
                    "value": `${process.env.RESERVATION_BASE_URL}${paymentId}`
                },
                {
                    "var": "message",
                    "value": getMessage(language, action)
                },
                {
                    "var": "paymentStatus",
                    "value": language === "hu-HU" ? "Rendezve" : reservation.paymentStatus
                }
            ]
        }
    ]
}

const getMessage = (language: string, action: Action) => {
    switch (action) {
        case Action.None:
        default:
            return language === "hu-HU" ?
                "Boldog szeretettel várunk a Craft Beer Spa-ban! Köszönjük, hogy ellátogatsz hozzánk." :
                "We look forward to seeing you at Craft Beer Spa! Thanks for choosing us."
        case Action.Change:
            return language === "hu-HU" ?
                "Foglalásod időpontját frissítettük." :
                "Your reservation date has been updated."
        case Action.Cancel:
            return language === "hu-HU" ?
                "Foglalásodat töröltük, és kártyádra visszautaltuk a foglalás összegét, mínusz egy 0,5% kezelési díjat." :
                "Your reservation was canceled, and the reservation cost, minus a 1.5% handling fee, was refunded to your card."
    }

}

