import React, { memo } from "react";

const Header = () => (
  <section className="Header">
    <img
      src="/assets/sharespatransparent.png"
      alt="shareLogo"
      className="Header__shareLogo"
    />
    Reservation
  </section>
);

export default memo(Header);
