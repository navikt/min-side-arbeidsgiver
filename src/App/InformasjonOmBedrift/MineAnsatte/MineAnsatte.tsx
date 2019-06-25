import React, { FunctionComponent, useContext, useState } from "react";
import "./MineAnsatte.less";
import TabellMineAnsatte from "./TabellMineAnsatte/TabellMineAnsatte";

interface Props {
  className?: string;
}

const MineAnsatte: FunctionComponent<Props> = props => {
  return (
    <div className={"hovedside-mine-ansatte"}>
      <TabellMineAnsatte />
    </div>
  );
};

export default MineAnsatte;
