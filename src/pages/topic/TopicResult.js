import { CCardFooter } from "@coreui/react";
import React from "react";
import FinalResult from "src/components/score/FinalResult";
import MidMark from "src/pages/guide/MidMark";
import api from "src/service/api";
import context from "src/service/contextService";

const MainComponent = ({ topic }) => {
  React.useEffect(() => {
    api.get(`/students/${context.user.id}/allow-register-topic`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCardFooter>
      <MidMark topic={topic} />
      {topic.students?.some((e) => e.midPass) && <FinalResult topic={topic} />}
    </CCardFooter>
  );
};

export default MainComponent;
