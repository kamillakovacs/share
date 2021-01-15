import * as Yup from "yup";

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const reservation = Yup.object().shape({
  date: Yup.date().required("Required"),
  time: Yup.string().required("Required"),
  numberOfGuests: Yup.object()
    .shape({
      value: Yup.string(),
      label: Yup.string(),
    })
    .required("Required"),
  numberOfTubs: Yup.object()
    .shape({
      value: Yup.string(),
      label: Yup.string(),
    })
    .required("Required"),
  price: Yup.string(),
  whereYouHeard: Yup.object()
    .shape({
      value: Yup.string(),
      label: Yup.string(),
    })
    .required("Required"),
  additionalTreatments: Yup.object().shape({
    value: Yup.string(),
    label: Yup.string(),
  }),
  firstName: Yup.string(),
  lastName: Yup.string(),
  phoneNumber: Yup.string()
    .matches(
      phoneRegex,
      "Please enter a valid phone number. (1234567890, 123-456-7890, +31636363634)"
    ),
  email: Yup.string()
    .email("Please enter a valid email address")
   
});
