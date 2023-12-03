import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { ReservationWithDetails } from "../../lib/validation/validationInterfaces";

export const sendReservationConfirmationEmail = async (reservation: ReservationWithDetails, paymentId: string, language: string) => {
    const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY,
    });

    const sentFrom = new Sender("hello@craftbeerspa.hu", "Craft Beer Spa");
    const recipients = [
        new Recipient("kamilla525@yahoo.com", `${reservation.firstName} ${reservation.lastName}`)
    ];

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

    const variables = [
        {
            "email": reservation.email,
            "substitutions": [
                {
                    "var": "name",
                    "value": `${reservation.firstName} ${reservation.lastName}`
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

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("Your Craft Beer Spa reservation")
        .setTemplateId(process.env.MAILERSEND_TEMPLATE_ID_ENGLISH)
        .setVariables(variables);

    await mailerSend.email.send(emailParams);
}
