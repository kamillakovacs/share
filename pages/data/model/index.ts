export enum TypeOfBath {
  Beer,
  Wine,
  Undefined,
}

export interface State {
  readonly reservation: {
    readonly date?: Date;
    readonly numberOfGuests: number;
    readonly numberOfTubs: number;
    readonly typeOfBath: TypeOfBath;
    readonly additionalTreatments?: string;
  };
}
