import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import React from "react";
import api from "src/service/api";
import CouncilInfo from "./CouncilInfo";
import TopicInCouncil from "./TopicInCouncil";

const MainComponent = () => {
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    const councilId = window.location.pathname.split("/").pop();
    console.log(councilId);
    api.get(`/councils/detail/${councilId}`).then(setData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardHeader>
        <h5 className="card-title mb-0">
          Hội đồng {data.subjectDepartmentName} mã số {data.id}
        </h5>
      </CCardHeader>
      <CCardBody>
        <CouncilInfo council={data} />
        <TopicInCouncil councilId={data.id} />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
