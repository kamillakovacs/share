export interface Reservation {
  date: Date;
  time: string;
  numberOfGuests: string;
  numberOfTubs: string;
  price: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whereYouHeard?: { label: string; value: string };
}
