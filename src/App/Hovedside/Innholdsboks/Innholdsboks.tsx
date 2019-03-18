import React, { FunctionComponent } from "react";
import "./Innholdsboks.less";

interface Props {}

const Innholdsboks: React.FunctionComponent<Props> = props => (
  <div className={"innholdsboks"}>{props.children}</div>
);

export default Innholdsboks;
