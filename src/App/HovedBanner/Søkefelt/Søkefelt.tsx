import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect
} from "react";
import { WrapperState } from "react-aria-menubutton";
import TjenesteBoksContainer from "../../Hovedside/TjenesteBoksContainer/TjenesteBoksContainer";
const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
}

const VirksomhetsVelgerNiva1: FunctionComponent<Props> = props => {
  return <AriaMenuButton.Menu />;
};

export default VirksomhetsVelgerNiva1;
