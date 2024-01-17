import React, { FC, memo, useEffect, useState } from "react";
import axios from "axios";
import classnames from "classnames";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { i18n, useTranslation } from "next-i18next";

import * as cancelPayment from "../api/paymentCancelation";
import * as changeReservation from "../api/makeReservation";

import { Reservation, ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { Action, CanceledBy, ReservationDataShort } from "../lib/interfaces";
import Calendar from "../components/calendar";

import reservationStyles from "../styles/reservation.module.scss";
import dateStyles from "../styles/reservationDate.module.scss";
import modalStyles from "../styles/modal.module.scss";

import Modal from "./modal";
import { PaymentStatus } from "../api/interfaces";


interface Props {
  reservation: ReservationWithDetails;
  currentReservations: ReservationDataShort[];
}

const EditReservation: FC<Props> = ({ reservation, currentReservations }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const paymentId = router.query.paymentId as string;
  const [date, setDate] = useState(reservation.date);

  const [action, setAction] = useState("");
  const [updateResponse, setUpdateResponse] = useState(0);
  const [showModal, setShowModal] = useState(false);

  //@ts-ignore
  const reservationIsMoreThan48HoursAway: boolean = Math.floor(Math.abs(new Date() - new Date(reservation.date)) / 36e5) >= 48
  const reservationIsInTheFuture: boolean = new Date(reservation.date).valueOf() > new Date().setHours(new Date().getHours() + 2)

  useEffect(() => {
    if (document && document.querySelector("#changeButton") && action == Action.Change) {
      document.querySelector("#changeButton").scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  })

  useEffect(() => {
    if (updateResponse === 200) {
      window.location.reload()
    }
  })

  useEffect(() => {
    const markUncancelable = async () => await axios
      .post("/api/markUncancelable", { paymentId })
      .then((res) => res.data)
      .catch((e) => {
        console.log("Error sending email confirming change")
        return e;
      });
    // if (!reservationIsMoreThan48HoursAway) {
    markUncancelable();
    // }
  }, [reservationIsMoreThan48HoursAway, paymentId])

  const change = async () => {
    setAction(Action.Change);
    await axios
      .post("/api/email", { reservation, paymentId, language: i18n.language, t, action: Action.Change, date })
      .then((res) => res.data)
      .catch((e) => {
        console.log("Error sending email confirming change")
        return e;
      });
  };

  const openModal = () => setShowModal(true)

  const cancel = async () => {
    setAction(Action.Cancel);
    setDate(date);
    await cancelPayment.useCancelPaymentRequest(paymentId, reservation, reservation.price, i18n.language)
      .then(() => {
        setShowModal(false);
        window.location.reload()
      })
  };

  const redirectToChangeReservation = async (date: Date) => {
    await changeReservation.updateReservationDate(date, paymentId).catch((e) => e);
  }

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

  const onSubmit = (values: Reservation) => {
    console.log("submit")
    setDate(values.date);
    return redirectToChangeReservation(values.date)
      .then(() => setUpdateResponse(200))
      .catch(() => setUpdateResponse(500))
  };

  const showCanceledButton =
    (!reservation.canceled || reservation.canceled === CanceledBy.BeerSpa) &&
    reservation.paymentStatus === PaymentStatus.Succeeded &&
    reservationIsInTheFuture;

  return (
    <div>
      <div className={reservationStyles.reservation__info}>
        {!reservation.canceled &&
          reservation.paymentStatus === PaymentStatus.Succeeded &&
          reservationIsInTheFuture && (
            <button
              className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__largemargin}`}
              id="changeButton"
              type="button"
              onClick={change}
            >
              {t("reservationDate.changeReservationDate")}
            </button>
          )
        }
        {showCanceledButton && (
          <>
            <button
              type="button"
              className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__margin}`}
              onClick={openModal}
            >
              {t("reservationDate.cancelReservation")}
            </button>
            {showModal &&
              <Modal onClose={() => setShowModal(false)} title="Cancelation">
                <span>Are you sure you want to cancel your reservation?</span>
                <button
                  type="submit"
                  className={`${modalStyles.button} ${reservationStyles.reservation__margin}`}
                  onClick={cancel}
                >
                  Yes, cancel it
                </button>
              </Modal>
            }
          </>
        )
        }



      </div>
      <Formik<Reservation>
        initialValues={initialValues}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        validateOnChange
      >
        {({ values, errors, dirty, handleSubmit }) => {
          const isFinalizeButtonEnabled = !!dirty && !Object.keys(errors).length && values.date.getHours() !== 0;
          return (
            <form onSubmit={handleSubmit}>
              {action === Action.Change && (
                <>
                  <section className={dateStyles.reservationDate}>
                    <Calendar currentReservations={currentReservations} isExistingReservation={true} />
                    <div className={reservationStyles.reservation__barion__container}>
                      <div className={reservationStyles.reservation__updated}>
                        <button
                          type="submit"
                          className={classnames(
                            `${reservationStyles.reservation__button} ${reservationStyles.reservation__finish} `,
                            { [reservationStyles.reservation__finish__enabled]: isFinalizeButtonEnabled }
                          )}
                        >
                          {t("reservationDate.finalizeDateChange")}
                        </button>
                        {updateResponse === 200 && (
                          <div className={reservationStyles.reservation__updated__text}>{t("reservationDate.updated")}</div>
                        )}
                        {updateResponse === 500 && (
                          <div className={reservationStyles.reservation__updated__text}>{t("reservationDate.updateError")}</div>
                        )}
                      </div>
                    </div>
                  </section>
                </>
              )}
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default memo(EditReservation);