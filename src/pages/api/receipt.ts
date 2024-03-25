import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { ReservationWithDetails } from '../../lib/validation/validationInterfaces';
import firebase from "firebase-admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const reservation: ReservationWithDetails = req.body.reservation;
    const database = firebase.database();
    const reservations = database.ref("reservations");

    const data = {
        "name": reservation.firstName + " " + reservation.lastName,
        "emails": [reservation.email],
        "block_id": process.env.BILLINGO_RECEIPT_BLOCK_ID,
        "type": "receipt",
        "payment_method": "barion",
        "currency": "HUF",
        "conversion_rate": 1,
        "electronic": true,
        "items": [
            {
                "product_id": getProductId(reservation.numberOfGuests, reservation.numberOfTubs)
            }
        ]
    }

    await axios
        .post(process.env.BILLINGO_RECEIPT_URL, data,
            { headers: { "Content-Type": "application/json", "X-API-KEY": process.env.BILLINGO_API_KEY } })
        .then(async (res: any) => {
            await reservations.update({
                [`${req.body.paymentId}/communication/receiptSent`]: true
            });
            return res.data
        })
        .catch(e => e)

    return res.status(200).json({ success: true });
}

const getProductId = (guests: { label: string, value: number }, tubs: { label: string, value: number }) => {
    switch (guests.value) {
        case 1:
            return process.env.BILLINGO_1_1_PRODUCT_ID
        case 2:
            if (tubs.value === 1) {
                return process.env.BILLINGO_2_1_PRODUCT_ID
            }

            if (tubs.value === 2) {
                return process.env.BILLINGO_2_2_PRODUCT_ID
            }
            break;
        case 3:
            if (tubs.value === 2) {
                return process.env.BILLINGO_3_2_PRODUCT_ID
            }

            if (tubs.value === 3) {
                return process.env.BILLINGO_3_3_PRODUCT_ID
            }
            break;
        case 4:
            if (tubs.value === 2) {
                return process.env.BILLINGO_4_2_PRODUCT_ID
            }

            if (tubs.value === 3) {
                return process.env.BILLINGO_4_3_PRODUCT_ID
            }
            break;
        case 5:
            return process.env.BILLINGO_5_3_PRODUCT_ID
        case 6:
            return process.env.BILLINGO_6_3_PRODUCT_ID
        default:
            return process.env.BILLINGO_1_1_PRODUCT_ID
    }
}
