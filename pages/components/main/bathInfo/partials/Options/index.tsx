import { useFormikContext } from "formik";
import React, { memo, useEffect } from "react";
import Select, { ActionMeta, ValueType } from "react-select";

import { Reservation } from "../../../../../validation/validationInterfaces";

const numberOfGuestsOptions = [
  { value: "1", label: "1 person" },
  { value: "2", label: "2 people" },
  { value: "3", label: "3 people" },
  { value: "4", label: "4 people" },
  { value: "5", label: "5 people" },
  { value: "6", label: "6 people" },
];

const onePersonTubOptions = [{ value: "1", label: "1 tub" }];
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
const fivePeopleTubOptions = [{ value: "5", label: "5 people in 3 tubs" }];
const sixPeopleTubOptions = [{ value: "6", label: "6 people in 3 tubs" }];

// const typeOfBath = [
//   { value: "beer", label: "Beer - 10.000 Ft / 28 EUR" },
//   { value: "wine", label: "Wine - 10.000 Ft / 28 EUR" },
// ];

const additionalTreatments = [
  { value: "hopsMassage", label: "Hops Massage" },
  { value: "swedishMassage", label: "Swedish Massage" },
];

const Options: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<Reservation>();

  useEffect(() => {
    setFieldValue("numberOfTubsOptions", getTubOptions()[0]);
  }, [values.numberOfGuestsOptions]);

  useEffect(() => {
    setFieldValue("price", setPrice());
  }, [values.numberOfTubsOptions]);

  const getTubOptions = () => {
    if (!values.numberOfGuestsOptions) {
      return onePersonTubOptions;
    } else {
      switch (values.numberOfGuestsOptions.value) {
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
    if (values.numberOfTubsOptions) {
      switch (values.numberOfTubsOptions.value) {
        case "1":
          return "18000";
        case "2.1":
          return "25000";
        case "2.2":
          return "30000";
        case "3.2":
          return "38000";
        case "3.3":
          return "42000";
        case "4.2":
          return "55000";
        case "4.3":
          return "63000";
        case "5":
          return "70000";
        case "6":
          return "82000";
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
      {/* <div className="Options">
        <label>{"Type of Bath"}:</label>
        <Select
          options={typeOfBath}
          name="typeOfBath"
          onChange={setTypeOfBath}
        />
      </div> */}

      <div className="Options">
        <label>{"Number of People"}:</label>
        <Select
          options={numberOfGuestsOptions}
          name="numberOfGuestsOptions"
          onChange={setOption}
          value={values.numberOfGuestsOptions}
        />
      </div>
      <div className="Options">
        <label>{"Number of Tubs"}:</label>
        <Select
          options={getTubOptions()}
          name="numberOfTubsOptions"
          onChange={setOption}
          value={values.numberOfTubsOptions}
        />
      </div>
      {/* {!!values.numberOfGuestsOptions && !!values.numberOfTubsOptions && (
        <div className="Options">
          <label>{"Additional Treatments"}:</label>
          <Select
            options={additionalTreatments}
            name="additionalTreatments"
            onChange={setOption}
          />
        </div>
      )} */}
    </>
  );
};

export default memo(Options);
