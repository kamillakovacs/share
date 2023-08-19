import React, { memo } from "react";

import headerStyles from "../styles/header.module.scss";
import Image from "next/image";

const Header = () => (
  <section className={headerStyles.Header}>
    <Image src="/assets/sharespatransparent.png" alt="shareLogo" className={headerStyles.Header__shareLogo} />
  </section>
);

export default memo(Header);
