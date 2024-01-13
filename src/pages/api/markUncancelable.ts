import { CanceledBy } from "../../lib/interfaces";

export default async function handler(req, res) {
    const firebase = require("../../lib/firebase").default;
    const { paymentId } = req.body;

    const database = firebase.database();
    const reservations = database.ref("reservations");

    await reservations.update({
        [`${paymentId}/canceled`]: CanceledBy.TooLate
    });

    return res.status(200).json({ success: true });
}
