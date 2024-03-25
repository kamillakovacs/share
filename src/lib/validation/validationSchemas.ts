import * as Yup from "yup";

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

export const reservation = Yup.object().shape({
  date: Yup.date().required("Required"),
  numberOfGuests: Yup.object()
    .shape({
      value: Yup.number(),
      label: Yup.string()
    })
    .required("Required"),
  numberOfTubs: Yup.object()
    .shape({
      value: Yup.number(),
      label: Yup.string()
    })
    .required("Required"),
  price: Yup.string().required("Required")
});

export const details = Yup.object().shape({
  date: Yup.date().required("Required"),
  numberOfGuests: Yup.object()
    .shape({
      value: Yup.number(),
      label: Yup.string()
    })
    .required("Required"),
  numberOfTubs: Yup.object()
    .shape({
      value: Yup.number(),
      label: Yup.string()
    })
    .required("Required"),
  price: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  phoneNumber: Yup.string()
    .matches(phoneRegex, "Please enter a valid phone number. (06301234567, +36201234567, 123-456-7890)")
    .required("Required"),
  email: Yup.string().email("Please enter a valid email address").required("Required"),
  whereYouHeard: Yup.object().shape({
    value: Yup.string().required("Required"),
    label: Yup.string().required("Required")
  }),
  termsAndConditions: Yup.bool().oneOf([true], "You need to accept the terms and conditions")
});
