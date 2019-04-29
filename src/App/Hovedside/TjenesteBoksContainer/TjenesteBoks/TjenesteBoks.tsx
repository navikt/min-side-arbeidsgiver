import React from "react";
import "./TjenesteBoks.less";
import classNames from "classnames";

interface Props {
  className?: string;
}

const TjenesteBoks: React.FunctionComponent<Props> = props => (
  <div>
    <div className={classNames("test", props.className)}>{props.children}</div>
  </div>
);

export default TjenesteBoks;
