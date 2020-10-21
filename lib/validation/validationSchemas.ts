import * as Yup from "yup";

export const reservation = Yup.object().shape({
  date: Yup.date().required(),
  numberOfGuestsOptions: Yup.object()
    .shape({
      value: Yup.string(),
      label: Yup.string(),
    })
    .required(),
  numberOfTubsOptions: Yup.object()
    .shape({
      value: Yup.string(),
      label: Yup.string(),
    })
    .required(),
  price: Yup.string(),
  additionalTreatments: Yup.object().shape({
    value: Yup.string(),
    label: Yup.string(),
  }),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNumber: Yup.string().required(),
  email: Yup.string().required(),
});
