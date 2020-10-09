import { ActionTypes, ReservationAction } from "./actions";
import { State, TypeOfBath } from "./model";

const initialState: State = {
  reservation: {
    date: undefined,
    numberOfGuests: 0,
    numberOfTubs: 0,
    typeOfBath: TypeOfBath.Undefined,
    additionalTreatments: undefined,
  },
};

export function reservation(state = initialState, action: ReservationAction) {
  switch (action.type) {
    case ActionTypes.Reserve:
      return {
        ...state,
        reservation: action.payload.reservation,
      };
  }
  return state;
}
