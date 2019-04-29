import React, { FunctionComponent } from "react";
import "./Tjenesteboks.less";
import classNames from "classnames";

interface Props {
  className?: string;
}

const Tjenesteboks: React.FunctionComponent<Props> = props => (
  <div>
    <div className={classNames("innholdsboks", props.className)}>
      {props.children}
    </div>
  </div>
);

export default Tjenesteboks;
