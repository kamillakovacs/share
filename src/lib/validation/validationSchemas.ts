import * as Yup from "yup";

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const reservation = Yup.object().shape({
  date: Yup.date().required("Required"),
  experience: Yup.object()
    .shape({
      value: Yup.string(),
      label: Yup.string(),
    })
    .required(),
  numberOfGuests: Yup.object()
    .shape({
      value: Yup.string(),
      label: Yup.string(),
    })
    .required(),
  numberOfTubs: Yup.object()
    .shape({
      value: Yup.string(),
      label: Yup.string(),
    })
    .required(),
  price: Yup.string(),
  whereYouHeard: Yup.object().shape({
    value: Yup.string(),
    label: Yup.string(),
  }),
  additionalTreatments: Yup.object().shape({
    value: Yup.string(),
    label: Yup.string(),
  }),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  phoneNumber: Yup.string()
    .matches(
      phoneRegex,
      "Please enter a valid phone number. (1234567890, 123-456-7890, +31636363634)"
    )
    .required("Required"),
  email: Yup.string().email("Please enter a valid email address"),
});
