import React, { FC, memo, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

//@ts-ignore
import CalendarCheckIcon from "../../public/assets/calendar-check.svg";
//@ts-ignore
import HeartIcon from "../../public/assets/heart.svg";
//@ts-ignore
import HottubIcon from "../../public/assets/hottub.svg";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

import detailsStyles from "../styles/details.module.scss";
import thanksStyles from "../styles/thanks.module.scss";

interface Props {
  reservation: ReservationWithDetails;
}

const ReservationSummary: FC<Props> = ({ reservation }) => {
  const { t } = useTranslation("common");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (reservation?.date) {
      setDate(
        new Intl.DateTimeFormat("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(reservation?.date))
      );
    }
  }, [reservation?.date]);

  return (
    <>
      <div className={thanksStyles.reservation}>
        <div className={thanksStyles.navigators}>
          <div className={thanksStyles.verticalLine} />
          <div className={thanksStyles.verticalLine2} />
        </div>
        <div className={thanksStyles.reservation__summary}>
          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <CalendarCheckIcon />
            </div>
            <label>{t("reservationSummary.reservationDetails")}</label>
          </div>
          <div className={detailsStyles.details}>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationSummary.location")}</div>
              <div>{t("reservationSummary.shareSpa")}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationSummary.tubsReserved")}</div>
              <div>{reservation?.numberOfTubs.label}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationSummary.date")}</div>
              <div>{date}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationSummary.lengthOfStay")}</div>
              <div>{t("reservationSummary.hourAndFifteenMins")}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationSummary.totalPrice")}</div>
              <div>
                {reservation?.price} {t("summary.huf")}
              </div>
            </div>
          </div>

          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <CalendarCheckIcon />
            </div>
            <label>Billing Details</label>
          </div>
          <div className={detailsStyles.details}>
            <div className={detailsStyles.details__row}>
              <div>Name</div>
              <div>
                {reservation?.firstName} {reservation?.lastName}
              </div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Email</div>
              <div>{reservation?.email}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Phone</div>
              <div>{reservation?.phoneNumber}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Date of Purchase</div>
              <div>{reservation?.dateOfPurchase}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Total price</div>
              <div>{reservation?.price} HUF</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Amount paid</div>
              <div></div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Remaining balance</div>
              <div></div>
            </div>
          </div>

          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <HottubIcon />
            </div>
            <label>{t("summary.yourExperience")}</label>
          </div>
          <div className={detailsStyles.details}>
            <div>{t("summary.infraredSauna")}</div>
            <div>{`${t("summary.soakFor")} ${reservation?.numberOfGuests ? reservation?.numberOfGuests.value : 1} ${
              reservation?.numberOfGuests
                ? parseInt(reservation.numberOfGuests.value) > 1
                  ? t("summary.people")
                  : t("summary.person")
                : t("summary.person")
            } in ${reservation?.numberOfTubs ? reservation?.numberOfTubs.value : "1"} ${
              parseInt(reservation?.numberOfTubs ? reservation?.numberOfTubs.value : "1") > 1
                ? t("summary.tubs")
                : t("summary.tub")
            } ${t("summary.ofBeerBath")} `}</div>
            <div>{t("summary.strawBed")} </div>
            <div>{t("summary.unlimitedBeer")} </div>
            <div>{t("summary.towelsAndRobes")} </div>
            <div>{t("summary.exclusiveUse")} </div>
          </div>

          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <HeartIcon />
            </div>
            <label>{t("reservationSummary.lookForwardToSeeingYou")}</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ReservationSummary);
