import React, { FC, memo, useEffect, useState } from "react";
import classnames from "classnames";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import * as cancelPayment from "../api/paymentCancelation";
import * as changeReservation from "../api/makeReservation";

import { Reservation, Reservations, ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { Action, ReservationDataShort } from "../lib/interfaces";
import Calendar from "../components/calendar";

import reservationStyles from "../styles/reservation.module.scss";
import dateStyles from "../styles/reservationDate.module.scss";
import modalStyles from "../styles/modal.module.scss";

import Modal from "./modal";


interface Props {
  reservations: Reservations;
  currentReservations: ReservationDataShort[];
}

const EditReservation: FC<Props> = ({ reservations, currentReservations }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const paymentId = router.query.paymentId as string;
  const reservation: ReservationWithDetails = reservations[paymentId];

  const [action, setAction] = useState("");
  const [updateResponse, setUpdateResponse] = useState(0);
  const [showModal, setShowModal] = useState(false);

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

  const change = () => {
    setAction(Action.Change);
  };

  const openModal = () => setShowModal(true)

  const cancel = async () => {
    setAction(Action.Cancel);
    await cancelPayment.useCancelPaymentRequest(paymentId, reservation.transactionId, reservation.price)
      .then(() => {
        setShowModal(false);
        window.location.reload()
      })
  };

  const redirectToChangeReservation = async (date: Date) =>
    await changeReservation.updateReservationDate(date, paymentId).catch((e) => e);

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
    return redirectToChangeReservation(values.date)
      .then(() => setUpdateResponse(200))
      .catch(() => setUpdateResponse(500))
  };

  return (
    <div>
      <div className={reservationStyles.reservation__info}>
        <button
          className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__largemargin}`}
          id="changeButton"
          type="button"
          onClick={change}
        >
          {t("reservationDate.changeReservationDate")}
        </button>
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