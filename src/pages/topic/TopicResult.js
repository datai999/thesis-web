import { CCardFooter } from "@coreui/react";
import React from "react";
import FinalResult from "src/components/score/FinalResult";
import MidMark from "src/pages/guide/MidMark";

const MainComponent = ({ topic }) => {
  return (
    <CCardFooter>
      <MidMark topic={topic} />
      {topic.students?.some((e) => e.midPass) && <FinalResult topic={topic} />}
    </CCardFooter>
  );
};

export default MainComponent;
