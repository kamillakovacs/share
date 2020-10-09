import { Store } from "redux";
import { State } from "../../data/model";

export interface PublicProps {
  store: Store<
    State,
    {
      type: string;
      payload: {
        reservation: any;
      };
    }
  >;
}

export type Props = PublicProps;
