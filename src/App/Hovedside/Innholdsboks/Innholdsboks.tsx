import React, { FunctionComponent } from "react";
import "./Innholdsboks.less";
import classNames from "classnames";

interface Props {
  className?: string;
}

const Innholdsboks: React.FunctionComponent<Props> = props => (
  <div className={classNames("innholdsboks", props.className)}>
    {props.children}
  </div>
);

export default Innholdsboks;
