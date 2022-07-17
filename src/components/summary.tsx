import React, { FC, memo } from "react";
import { useFormikContext } from "formik";
import { useTranslation } from "next-i18next";

import { Reservation } from "../lib/validation/validationInterfaces";

import styles from "../styles/main.module.scss";
import summaryStyles from "../styles/summary.module.scss";

const Summary: FC = () => {
  const { values } = useFormikContext<Reservation>();
  const { t } = useTranslation("common");

  return (
    <>
      <div className={summaryStyles.label}>
        <div className={styles.cart} />
        <label>{t("summary.yourExperience")}</label>
      </div>

      <div className={summaryStyles.container}>
        <div>{t("summary.infraredSauna")}</div>
        <div>{`${t("summary.soakFor")} ${values.numberOfGuests ? values.numberOfGuests.value : 1} ${
          values.numberOfGuests
            ? parseInt(values.numberOfGuests.value) > 1
              ? t("summary.people")
              : t("summary.person")
            : t("summary.person")
        } in ${values.numberOfTubs ? values.numberOfTubs.value : "1"} ${
          parseInt(values.numberOfTubs ? values.numberOfTubs.value : "1") > 1 ? t("summary.tubs") : t("summary.tub")
        } ${t("summary.ofBeerBath")} `}</div>
        <div>{t("summary.strawBed")} </div>
        <div>{t("summary.unlimitedBeer")} </div>
        <div>{t("summary.towelsAndRobes")} </div>
        <div>{t("summary.exclusiveUse")} </div>
        <div className={summaryStyles.total}>
          <div>
            {t("summary.total")} <span className={summaryStyles.vat}>{t("summary.vat")} </span>
          </div>
          {values.price && <div>{`${values.price} ${t("summary.huf")} `}</div>}
        </div>
      </div>
    </>
  );
};

export default memo(Summary);
