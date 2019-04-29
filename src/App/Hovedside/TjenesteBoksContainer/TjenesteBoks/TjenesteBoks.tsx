import React, { FunctionComponent } from "react";
import "./TjenesteBoks.less";
import classNames from "classnames";
import TjenesteBoksBanner from "./TjenesteBoksBanner/TjenesteBoksBanner";

interface Props {
  className?: string;
  ikonsrc: string;
  tittel: string;
}

const TjenesteBoks: React.FunctionComponent<Props> = props => {
  return (
    <div>
      <TjenesteBoksBanner tittel={props.tittel} ikonsrc={props.ikonsrc} />
      {this.props.children}
    </div>
  );
};

export default TjenesteBoks;
