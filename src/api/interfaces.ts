import { PaymentStatus } from "../lib/validation/validationInterfaces";

export interface BarionTransactions {
  Currency: string;
  POSTransactionId: string;
  RelatedId: string;
  Status: PaymentStatus;
  TransactionId: string;
  TransactionTime: string;
}

export interface BarionPaymentErrors {
  ErrorCode: string;
  Title: string;
  Description: string;
  EndPoint: string;
  AuthData: string;
  HappenedAt: Date;
}

export interface BarionPaymentResponse {
  CallbackUrl: string;
  Errors: BarionPaymentErrors[];
  GatewayUrl: string;
  PaymentId: string;
  PaymentRequestId: string;
  QRUrl: string;
  RecurrenceResult: string;
  RedirectUrl: string;
  Status: PaymentStatus;
  ThreeDSAuthClientData: string;
  TraceId: string;
  Transactions: BarionTransactions[];
}

export interface BarionPaymentResponseData {
  data: BarionPaymentResponse;
}
