import firebase from "firebase-admin";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { NextApiRequest, NextApiResponse } from "next";

import { ReservationWithDetails } from "../../lib/validation/validationInterfaces";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { reservation, paymentId, language, change, date } = req.body;
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
        .setSubject(isHungarian ? "Craft Beer Spa foglalás" : "Your Craft Beer Spa reservation")
        .setTemplateId(isHungarian ? process.env.MAILERSEND_TEMPLATE_ID_HUNGARIAN : process.env.MAILERSEND_TEMPLATE_ID_ENGLISH)
        .setVariables(getVariables(reservation, language, paymentId, change, date));

    await mailerSend.email.send(emailParams)
        .then(async () => await reservations.update({
            [`${req.body.paymentId}/communication/reservationEmailSent`]: true
        }))
        .catch(e => console.log(e));

    return res.status(200).json({ success: true });
}

const getVariables = (
    reservation: ReservationWithDetails,
    language: string,
    paymentId: string,
    change?: boolean,
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
                    "var": "name",
                    "value": reservation.firstName
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
                    "value": reservation.price.toString()
                },
                {
                    "var": "tax",
                    "value": reservation.price.toString()
                },
                {
                    "var": "totalPrice",
                    "value": reservation.price.toString()
                },
                {
                    "var": "url",
                    "value": `${process.env.RESERVATION_BASE_URL}${paymentId}`
                },
                {
                    "var": "message",
                    "value": getMessage(language, change)
                },
                {
                    "var": "paymentStatus",
                    "value": reservation.paymentStatus
                }
            ]
        }
    ]
}

const getMessage = (language: string, change: boolean) =>
    language === "hu-HU" ?
        change ?
            "Foglalásod időpontját frissítettük." :
            "Boldog szeretettel várunk a Craft Beer Spa-ban! Köszönjük, hogy ellátogatsz hozzánk." :
        change ?
            "Your reservation date has been updated" :
            "We look forward to seeing you at Craft Beer Spa! Thanks for choosing us."
