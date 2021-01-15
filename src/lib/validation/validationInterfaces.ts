export interface Reservation {
  date: Date;
  time: string;
  numberOfGuests: { label: string; value: string };
  numberOfTubs: { label: string; value: string };
  price: string;
 
}

export interface ReservationWithDetails {
  date: Date;
  time: string;
  numberOfGuests: string;
  numberOfTubs: string
  price: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whereYouHeard?: { label: string; value: string };
  paymentMethod: string;
}
