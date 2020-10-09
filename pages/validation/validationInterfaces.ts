export interface Reservation {
  date: Date;
  time: Date;
  numberOfGuestsOptions: { label: string; value: string };
  numberOfTubsOptions: { label: string; value: string };
  price: string;
  additionalTreatments: { label: string; value: string };
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}
