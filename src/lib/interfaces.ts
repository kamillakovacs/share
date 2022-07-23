export interface ReservationData {
  date: Date;
  dateOfPurchase?: Date;
  numberOfGuests: { label: string; value: string };
  numberOfTubs: { label: string; value: string };
  price: string;
  additionalTreatments?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whereYouHeard?: { label: string; value: string };
  paymentStatus: string;
  paymentMethod: string;
  transactionId?: string;
}

export interface ReservationDataShort {
  date: Date;
  numberOfGuests: { label: string; value: string };
  numberOfTubs: { label: string; value: string };
}
