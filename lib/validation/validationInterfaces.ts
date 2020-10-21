export interface Reservation {
  date: Date;
  time: Date;
  numberOfGuests: { label: string; value: string };
  numberOfTubs: { label: string; value: string };
  price: string;
  additionalTreatments?: { label: string; value: string };
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}
