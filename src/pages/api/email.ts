import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { ReservationWithDetails } from "../../lib/validation/validationInterfaces";
import firebase from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const reservation: ReservationWithDetails = req.body.reservation;
    const database = firebase.database();
    const reservations = database.ref("reservations");
    const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY,
    });
    const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL, "Craft Beer Spa");
    const recipients = [
        new Recipient(reservation.email, `${reservation.firstName} ${reservation.lastName}`)
    ];
    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("Your Craft Beer Spa reservation")
        .setTemplateId(process.env.MAILERSEND_TEMPLATE_ID_ENGLISH)
        .setVariables(getVariables(reservation, req.body.language, req.body.paymentId));

    await mailerSend.email.send(emailParams)
        .then(async res => {
            await reservations.update({
                [`${req.body.paymentId}/communication/reservationEmailSent`]: true
            });
            return res.body
        })
        .catch(e => e);

    return res.status(200).json({ success: true });
}

const getVariables = (reservation: ReservationWithDetails, language: string, paymentId: string) => {
    const date = new Intl.DateTimeFormat(language, {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(reservation?.date))


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
                    "value": `${reservation.numberOfTubs.value} tubs for ${reservation.numberOfGuests.value} guests`,
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
                }
            ]
        }
    ]
}
