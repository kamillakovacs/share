import { createStore } from "redux";
import { reservation } from "./data/reducer";

import Main from "./components/main";

const store = createStore(reservation);

export default function Home() {
  return <Main store={store} />;
}
