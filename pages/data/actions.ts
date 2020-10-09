import * as actions from "./actions";
import { CreateActionType } from "../core/types";

export const ActionTypes = {
  Reserve: "reserve",
};

export const setReservation = (reservation: any) => {
  return {
    type: ActionTypes.Reserve,
    payload: { reservation },
  };
};

export type ReservationAction = CreateActionType<typeof actions>;
