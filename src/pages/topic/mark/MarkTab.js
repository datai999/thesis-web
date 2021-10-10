import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import React from "react";
import Criterion from "../../template/Criterion";

const MainComponent = ({ data }) => {
  return (
    <CCard>
      <CCardHeader>{data.description}</CCardHeader>
      <CCardBody className="pl-0 mr-3">
        <Criterion criterion={data} deep={0} />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
