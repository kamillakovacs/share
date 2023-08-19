import React, { memo } from "react";
import Image from "next/image";

import headerStyles from "../styles/header.module.scss";
import share from "../../public/assets/sharespatransparent.png";

const Header = () => (
  <section className={headerStyles.Header}>
    <Image src={share} alt="shareLogo" className={headerStyles.Header__shareLogo} />
  </section>
);

export default memo(Header);
