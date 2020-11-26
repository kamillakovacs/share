import React, { FC, memo } from "react";

import Header from "../components/header";

const Thanks: FC = () => {
  return (
    <article className="Main">
      <Header />
      <section className="Main__container">
        <span>
          Thank you for your reservation! We look forward to seeing you at the
          Share Spa.
        </span>
        <span>Reservation details:</span>
      </section>
    </article>
  );
};

export default memo(Thanks);
