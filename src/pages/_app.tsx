import "../styles/globals.scss";
import "react-datepicker/dist/react-datepicker.css";

import { AppProvider } from "../../context/appContext";

function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default App;
