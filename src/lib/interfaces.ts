export interface ReservationData {
  date: Date;
  dateOfPurchase?: Date;
  numberOfGuests: { label: string; value: number };
  numberOfTubs: { label: string; value: number };
  price: string;
  additionalTreatments?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whereYouHeard?: { label: string; value: string };
  paymentStatus: string;
  paymentMethod: string;
  canceledByCustomer: boolean;
  communication: Communication;
  transactionId?: string;
}

export interface ReservationDataShort {
  date: Date;
  numberOfGuests: { label: string; value: number };
  numberOfTubs: { label: string; value: number };
}

export interface ReceiptEmail {
  subject: string;
  body: string;
}

export interface Communication {
  reservationEmailSent: boolean;
  rescheduleEmailSentCount: number;
  cancelationEmailSent: boolean;
}

export enum Action {
  Change = "change",
  Cancel = "cancel"
}