import React, { FC, memo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

import thanksStyles from "../styles/thanks.module.scss";

interface Props {
  reservation: ReservationWithDetails;
}

const Unsuccessful: FC<Props> = ({ reservation }) => {
  const { query } = useRouter();
  const { t } = useTranslation("common");
  const [date, setDate] = useState("");
  const [dateOfPurchase, setDateOfPurchase] = useState("");

  if (reservation) {
    const emailData = {
      name: `${reservation?.firstName} ${reservation?.lastName}`,
      date,
      dateOfPurchase,
      numberOfTubs: reservation?.numberOfTubs.label,
      totalPrice: reservation?.price
    };
  }

  return (
    <article className={thanksStyles.container}>
      <label className={thanksStyles.reservation__title}>
        <span>Your reservation was not successful</span>
      </label>
    </article>
  );
};

export default memo(Unsuccessful);
