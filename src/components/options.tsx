import { Slider } from "@material-ui/core";
import { useFormikContext } from "formik";
import React, { FC, memo, useEffect } from "react";
import Select, { ActionMeta, ValueType } from "react-select";

import { Reservation } from "../lib/validation/validationInterfaces";

import optionStyles from "../styles/options.module.scss"

const experienceOptions = [
  { value: "1", label: "Experience 1" },
  { value: "2", label: "Experience 2" },
  { value: "3", label: "Experience 3" },
  { value: "4", label: "Experience 4" },
];

const numberOfGuestsOptions = [
  { value: "1", label: "1 person" },
  { value: "2", label: "2 people" },
  { value: "3", label: "3 people" },
  { value: "4", label: "4 people" },
  { value: "5", label: "5 people" },
  { value: "6", label: "6 people" },
];

const onePersonTubOptions = [{ value: "1.1", label: "1 tub" }];
const twoPeopleTubOptions = [
  { value: "2.1", label: "2 people in 1 tub" },
  { value: "2.2", label: "2 people in 2 tubs" },
];
const threePeopleTubOptions = [
  { value: "3.2", label: "3 people in 2 tubs" },
  { value: "3.3", label: "3 people in 3 tubs" },
];
const fourPeopleTubOptions = [
  { value: "4.2", label: "4 people in 2 tubs" },
  { value: "4.3", label: "4 people in 3 tubs" },
];
const fivePeopleTubOptions = [{ value: "5.3", label: "5 people in 3 tubs" }];
const sixPeopleTubOptions = [{ value: "6.3", label: "6 people in 3 tubs" }];

const Options: FC = () => {
  const { values, setFieldValue } = useFormikContext<Reservation>();

  useEffect(() => {
    setFieldValue("numberOfTubs", getTubOptions()[0]);
  }, [values.numberOfGuests]);

  useEffect(() => {
    setFieldValue("price", setPrice());
  }, [values.numberOfTubs]);

  const getTubOptions = () => {
    if (!values.numberOfGuests) {
      return onePersonTubOptions;
    } else {
      switch (values.numberOfGuests.value) {
        case "1":
          return onePersonTubOptions;
        case "2":
          return twoPeopleTubOptions;
        case "3":
          return threePeopleTubOptions;
        case "4":
          return fourPeopleTubOptions;
        case "5":
          return fivePeopleTubOptions;
        case "6":
          return sixPeopleTubOptions;
      }
    }
  };

  const setPrice = () => {
    if (values.numberOfTubs) {
      switch (values.numberOfTubs.value) {
        case "1.1":
          return "18000";
        case "2.1":
          return "22000";
        case "2.2":
          return "32000";
        case "3.2":
          return "40000";
        case "3.3":
          return "54000";
        case "4.2":
          return "44000";
        case "4.3":
          return "58000";
        case "5.5":
          return "62000";
        case "6.6":
          return "66000";
      }
    }
  };
  const setOption = (
    option: ValueType<{ value: string; label: string }>,
    select: ActionMeta<{ value: string; label: string }>
  ) => {
    setFieldValue(select.name!, option);
    setFieldValue("price", setPrice());
  };

  return (
    <>
      <div className={optionStyles.options}>
        <label>Number of People & Tubs</label>
      </div>
      <div className={optionStyles.options__sliderContainer}>
      <Slider 
        defaultValue={30}
        // getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={6}
        disabled />
    </div>
      </>
    
  );
};

export default memo(Options);
