import React from "react";
import "./Tekstboks.less";
import classNames from "classnames";

interface Props {
  className?: string;
}

const Tekstboks: React.FunctionComponent<Props> = props => (
  <div className={classNames("tekstboks", props.className)}>
    {props.children}
  </div>
);

export default Tekstboks;
