import React, { FC, memo, useEffect, useState } from "react";
import classnames from "classnames";
import firebase from "../lib/firebase";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Reservation, Reservations, ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { ReservationData, ReservationDataShort } from "../lib/interfaces";
import Calendar from "../components/calendar";

import thanksStyles from "../styles/thanks.module.scss";
import detailsStyles from "../styles/details.module.scss";
import reservationStyles from "../styles/reservation.module.scss";

import CalendarCheckIcon from "../../public/assets/calendar-check.svg";
import HeartIcon from "../../public/assets/heart.svg";
import HottubIcon from "../../public/assets/hottub.svg";

interface Props {
  reservations: Reservations[];
  users: ReservationData[];
  currentReservations: ReservationDataShort[];
}

enum Action {
  Change = "change",
  Cancel = "cancel"
}

const Reservation: FC<Props> = ({ reservations, users, currentReservations }) => {
  const { query } = useRouter();
  const { t } = useTranslation("common");
  const paymentId = query.paymentId as string;
  const reservation: ReservationWithDetails = reservations[paymentId];

  const [date, setDate] = useState("");
  const [action, setAction] = useState("");

  useEffect(() => {
    if (reservation?.date) {
      setDate(
        new Intl.DateTimeFormat("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date(reservation?.date))
      );
    }
  }, [reservation?.date]);

  const change = () => setAction(Action.Change);
  const cancel = () => setAction(Action.Cancel);

  const initialValues = {
    date: null,
    numberOfGuests: reservation.numberOfGuests,
    numberOfTubs: reservation.numberOfTubs,
    price: reservation.price,
    firstName: reservation.firstName,
    lastName: reservation.lastName,
    phoneNumber: reservation.phoneNumber,
    email: reservation.email,
    paymentMethod: reservation.paymentMethod
  };
  console.log(reservation);
  const onSubmit = (values: Reservation) => {
    const reservationData: ReservationData = {
      date: values.date,
      dateOfPurchase: new Date(),
      numberOfGuests: values.numberOfGuests,
      numberOfTubs: values.numberOfTubs,
      price: values.price,
      firstName: "firstName",
      lastName: "lastName",
      phoneNumber: "222222222222",
      email: "email@email.com",
      whereYouHeard: { value: "none", label: "None" },
      paymentStatus: null,
      paymentMethod: null
    };

    // return redirectToDetailsPage(reservationData);
  };

  return (
    <article className={thanksStyles.container}>
      <label className={thanksStyles.reservation__title}>
        <span>Your reservation at Share Spa</span>
      </label>

      <div className={reservationStyles.reservation__summary}>
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
                <HottubIcon />
              </div>
              <label>{t("summary.yourExperience")}</label>
            </div>
            <div className={detailsStyles.details}>
              <div>{t("summary.infraredSauna")}</div>
              <div>{`${t("summary.soakFor")} ${reservation?.numberOfGuests ? reservation?.numberOfGuests.value : 1} ${
                reservation?.numberOfGuests
                  ? reservation.numberOfGuests.value > 1
                    ? t("summary.people")
                    : t("summary.person")
                  : t("summary.person")
              } in ${reservation?.numberOfTubs ? reservation?.numberOfTubs.value : 1} ${
                reservation?.numberOfTubs
                  ? reservation?.numberOfTubs.value > 1
                    ? t("summary.tubs")
                    : t("summary.tub")
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

        <div className={reservationStyles.reservation__info}>
          <button
            className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__largemargin}`}
            type="button"
            onClick={change}
          >
            Change your reservation date
          </button>
          <button
            type="submit"
            className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__margin}`}
            onClick={cancel}
          >
            Cancel your reservation
          </button>
        </div>
      </div>

      <Formik<Reservation>
        initialValues={initialValues}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        validateOnChange
      >
        {({ errors, dirty, handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              {action === Action.Change && (
                <section className={reservationStyles.reservation__section}>
                  <Calendar currentReservations={currentReservations} isExistingReservation={true} />
                  <div className={reservationStyles.reservation__barion__container}>
                    <img
                      src="/assets/barion-card-strip-intl__small.png"
                      alt="barion-logo"
                      className={detailsStyles.barion}
                    ></img>
                    <button
                      type="submit"
                      className={classnames(
                        `${reservationStyles.reservation__button} ${reservationStyles.reservation__finish} `,
                        {
                          [reservationStyles.reservation__finish__enabled]: !!dirty && !Object.keys(errors).length
                        }
                      )}
                    >
                      {t("details.finishAndPay")}
                    </button>
                  </div>
                </section>
              )}
            </form>
          );
        }}
      </Formik>
    </article>
  );
};

export async function getServerSideProps({ locale }) {
  const res = firebase.database().ref("reservations");
  const customers = firebase.database().ref("customers");

  const reservations = await res.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  const users: ReservationData[] = await customers.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  const currentReservations: ReservationDataShort[] = await res?.once("value").then(function (snapshot) {
    return (
      Object.values(snapshot.val()).map((res: Reservation) => ({
        date: res.date ?? null,
        numberOfGuests: res.numberOfGuests ?? null,
        numberOfTubs: res.numberOfTubs ?? null
      })) || []
    );
  });

  return { props: { ...(await serverSideTranslations(locale, ["common"])), reservations, users, currentReservations } };
}

export default memo(Reservation);
