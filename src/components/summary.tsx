import React, { FC, memo } from "react";
import { useFormikContext } from "formik";
import { useTranslation } from "next-i18next";

import { Reservation } from "../lib/validation/validationInterfaces";

import styles from "../styles/main.module.scss";
import summaryStyles from "../styles/summary.module.scss";
import { currencyFormat } from "../lib/util/currencyFormat";

const Summary: FC = () => {
  const { values } = useFormikContext<Reservation>();
  const { t } = useTranslation("common");

  return (
    <>
      <div className={summaryStyles.label}>
        <div className={styles.cart} />
        <label>{t("summary.details")}</label>
      </div>

      <div className={summaryStyles.container}>
        <div>{t("summary.exclusiveUse")}</div>
        <div>{t("summary.bath")}</div>
        <div>{t("summary.unlimitedBeer")}</div>
        <div>{t("summary.infraredSauna")}</div>
        <div>{t("summary.strawBed")}</div>
        <div>{t("summary.snacks")}</div>
        <div>{t("summary.towelsAndRobes")}</div>

        <div className={summaryStyles.total}>
          <div>
            {t("summary.total")} <span className={summaryStyles.vat}>{t("summary.vat")} </span>
          </div>
          {values.price && <div>{currencyFormat.format(parseFloat(values.price))}</div>}
        </div>
      </div>
    </>
  );
};

export default memo(Summary);
