import React from "react";
import { useHistory } from "react-router-dom";
import { initContext } from "src/service/contextService";
import { TheContent, TheHeader, TheSidebar } from "./index";

const TheLayout = () => {
  const history = useHistory();

  const [waitingInit, setWaitingInit] = React.useState(false);

  const init = async () => {
    setWaitingInit(true);
    const token = await initContext();
    setWaitingInit(false);
    if (!token) {
      history.push(`/login`);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  if (waitingInit) throw new Promise(() => {});
  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader />
        <div className="c-body">
          <TheContent />
        </div>
        {/* <TheFooter/> */}
      </div>
    </div>
  );
};

export default TheLayout;
