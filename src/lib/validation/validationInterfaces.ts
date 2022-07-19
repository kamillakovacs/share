export enum PaymentStatus {
  Unpaid = "UNPAID",
  Success = "Success",
}

export interface Reservation {
  date: Date;
  numberOfGuests: { label: string; value: string };
  numberOfTubs: { label: string; value: string };
  price: string;
}

export interface ReservationWithDetails {
  date: Date;
  numberOfGuests: { label: string; value: string };
  numberOfTubs: { label: string; value: string };
  price: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whereYouHeard?: { label: string; value: string };
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
}
