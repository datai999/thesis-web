import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import React, { useEffect } from "react";
import api from "../../../service/api";

const MainComponent = () => {
  useEffect(() => {
    api.get("/persons/topics");
  });

  return (
    <CCard>
      <CCardHeader></CCardHeader>
      <CCardBody>@hcmut.edu.vn</CCardBody>
    </CCard>
  );
};

export default MainComponent;
