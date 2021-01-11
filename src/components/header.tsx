import React, { memo } from "react";
import headerStyles from "../styles/header.module.scss"

const Header = () => (
  <section className={headerStyles.Header}>
    <img
      src="/assets/sharespatransparent.png"
      alt="shareLogo"
      className={headerStyles.Header__shareLogo}
    />
    Reservation
  </section>
);

export default memo(Header);
