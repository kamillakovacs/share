import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export const sendReservationConfirmationEmail = async (name, email) => {
    const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY,
    });

    const sentFrom = new Sender("hello@craftbeerspa.hu", "Craft Beer Spa");
    const recipients = [
        new Recipient("hello@craftbeerspa.hu", name)
    ];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("This is a Subject")
        .setHtml("<strong>This is the HTML content</strong>")
        .setText("This is the text content");

    await mailerSend.email.send(emailParams);
}
