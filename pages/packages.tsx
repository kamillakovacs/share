import classnames from "classnames";
import React, { FC, memo, useState } from "react";

const Packages: FC = () => {
  const [open, setOpen] = useState(false);
  const [inTransition, setInTransition] = useState(false);

  const togglePanel = () => {
    setOpen(!open);
    setInTransition(true);
  };

  const afterTransition = () => setInTransition(false);

  return (
    <article className="Packages">
      <span className="Packages__title">Packages</span>
      <section
        className={classnames("Accordion", {
          "Accordion--open": open,
        })}
      >
        <section className={"Accordion__indicator"} onClick={togglePanel}>
          <section className="Accordion__indicatorContent">
            <section
              className={
                "Accordion__indicatorContentItem Accordion__indicatorContentItem--block"
              }
            >
              <article>
                Infra Sauna, Beer Spa, Relaxing Straw Bed, Snacks, Unlimitied
                Beer
              </article>
            </section>
            {/* {showIcon && iconPosition === "right" && ( */}
            {/* <section className="Accordion__indicatorContentItem Accordion__indicatorContentItem--center Accordion__indicatorContentItem--rotate"> */}
            {/* <Icon
                  icon={Type.DownArrow}
                  className="Accordion__indicatorIcon"
                /> */}
            {/* </section> */}
            {/* )} */}
          </section>
        </section>
        <section
          className={"Accordion__panel"}
          onTransitionEnd={afterTransition}
        >
          {(inTransition || open) && "Test test test"}
        </section>
      </section>
    </article>
  );
};

export default memo(Packages);

// componentDidUpdate(prevProps: Props) {
//   const { isOpen } = this.props;

//   if (isOpen !== undefined && prevProps.isOpen !== isOpen) {
//     this.togglePanel(isOpen);
//   }
// }

// render() {
//   const {
//     indicator,
//     children,
//     className = "",
//     showIcon = true,
//     iconPosition = IconPosition.Right,
//     useTextColor = false,
//     subTitle,
//     fillSpace,
//   } = this.props;

//   return (

//   );
// }
