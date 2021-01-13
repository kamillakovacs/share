import { Slider } from "@material-ui/core";
import { useFormikContext } from "formik";
import React, { FC, memo } from "react";

import { Reservation } from "../lib/validation/validationInterfaces";

import optionStyles from "../styles/options.module.scss"
import styles from "../styles/main.module.scss"
import classNames from "classnames";

const Options: FC = () => {
  const { values, touched, setFieldValue, setFieldTouched } = useFormikContext<Reservation>();

  const setPrice = () => {
    if (values.numberOfGuests) {
      switch (values.numberOfGuests) {
        case "1":
          return "18000";
        case "2":
          return values.numberOfTubs === "1" ? "22000" : "32000";
        case "3":
          return values.numberOfTubs === "2" ? "40000" : "54000";
        case "4":
          return values.numberOfTubs === "2" ? "44000" : "58000";
        case "5":
          return "62000";
        case "6":
          return "66000";
      }
    }
  };
  const setNumberOfGuests = (_e: React.ChangeEvent, value: number ) => {
    setFieldValue("numberOfGuests", value);
    setFieldTouched("numberOfGuests")
    setFieldValue("price", setPrice());
  };
  const setNumberOfTubs = (_e: React.ChangeEvent, value: number ) => {
    setFieldValue("numberOfTubs"!, value);
    setFieldTouched("numberOfTubs")
    setFieldValue("price", setPrice());
  };

  return (
    <>
      <div className={optionStyles.options}>
      <div className={classNames(`${styles.todoitem} ${styles.todoitem__two}`, {
        [styles.todoitem__done]: values.numberOfGuests && values.numberOfTubs && touched.numberOfGuests && touched.numberOfTubs
      })} />
        <label>Number of People & Tubs</label>
      </div>
      <div className={optionStyles.options__container}>
      <img src="/assets/people.svg" />
      <span className={optionStyles.options__peopleCounter}>{`${values.numberOfGuests} people`}</span>
      <div className={optionStyles.options__sliderContainer}>
        <Slider 
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={1}
          max={6}
          valueLabelDisplay="off"
          onChange={setNumberOfGuests}
          />
      </div>
    </div>
    <div className={optionStyles.options__container}>
      <img src="/assets/hottub.svg" />
      <span className={optionStyles.options__peopleCounter}>{`${values.numberOfTubs} hot tubs`}</span>
      <div className={optionStyles.options__sliderContainer}>
        <Slider 
          name={"numberOfTubs"}
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={1}
          max={3}
          valueLabelDisplay="off"
          onChange={setNumberOfTubs}
          />
      </div>
      
    </div>
      </>
    
  );
};

export default memo(Options);
