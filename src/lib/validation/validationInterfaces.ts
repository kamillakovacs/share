export interface Reservation {
  date: string;
  time: string;
  experience: { label: string; value: string };
  numberOfGuests: { label: string; value: string };
  numberOfTubs: { label: string; value: string };
  price: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  additionalTreatments?: { label: string; value: string };
  whereYouHeard?: { label: string; value: string };
}
