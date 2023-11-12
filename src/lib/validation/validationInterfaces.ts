import { PaymentStatus } from "../../api/interfaces";
import { Communication } from "../interfaces";

export interface Reservation {
  date: Date;
  numberOfGuests: { label: string; value: number };
  numberOfTubs: { label: string; value: number };
  price: string;
}

export interface ReservationWithDetails {
  date: Date;
  dateOfPurchase?: Date;
  numberOfGuests: { label: string; value: number };
  numberOfTubs: { label: string; value: number };
  price: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whereYouHeard?: { label: string; value: string };
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
  canceledByCustomer: boolean;
  communication: Communication;
  transactionId?: string;
}

export interface Reservations {
  [key: string]: ReservationWithDetails;
}
