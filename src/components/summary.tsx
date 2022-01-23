import { useFormikContext } from "formik";
import React, { FC, memo } from "react";

import { Reservation } from "../lib/validation/validationInterfaces";

import styles from "../styles/main.module.scss";
import summaryStyles from "../styles/summary.module.scss";

const Summary: FC = () => {
  const {
    values,
    touched,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<Reservation>();

  return (
    <>
      <div className={summaryStyles.label}>
        <div className={styles.cart} />
        <label>Your Experience</label>
      </div>

      <div className={summaryStyles.container}>
        <div>- 15 minute pre-treatment in infra sauna</div>
        <div>{`- 40 minute soak for ${
          values.numberOfGuests ? values.numberOfGuests.value : 1
        } ${
          values.numberOfGuests
            ? parseInt(values.numberOfGuests.value) > 1
              ? "people"
              : "person"
            : "person"
        } in ${values.numberOfTubs ? values.numberOfTubs.value : "1"} tub${
          parseInt(values.numberOfTubs ? values.numberOfTubs.value : "1") > 1
            ? "s"
            : ""
        } of beer bath`}</div>
        <div>- 15 minute relaxation on straw bed</div>
        <div>- Unlimited beer on tap throughout your stay</div>
        <div>- Towels and bathrobes</div>
        <div>
          - Exclusive use of our beer spa facility (the whole spa is yours!)
        </div>
        <div className={summaryStyles.total}>
          <div>
            Total: <span className={summaryStyles.vat}>(incl.VAT)</span>
          </div>
          <div>{`${values.price ? values.price : "18 000"} HUF`}</div>
        </div>
      </div>
    </>
  );
};

export default memo(Summary);
