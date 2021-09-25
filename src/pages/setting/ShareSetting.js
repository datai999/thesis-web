import { CCol, CRow } from "@coreui/react";
import React from "react";
import ShareSettingTable from "./ShareSettingTable";

const settings = {
  educationMethod: {
    headerTitle: "Phương thức đào tạo",
    baseURL: "/education-methods",
  },
  degree: {
    headerTitle: "Học vị",
    baseURL: "/degrees",
  },
  subjectDepartment: {
    headerTitle: "Phòng ban - Bộ môn",
    baseURL: "/subject-departments",
  },
  major: {
    headerTitle: "Chuyên ngành",
    baseURL: "/majors",
  },
};

const MainComponent = () => {
  return (
    <>
      <CRow>
        <CCol>
          <ShareSettingTable props={settings.educationMethod} />
        </CCol>
        <CCol>
          <ShareSettingTable props={settings.degree} />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <ShareSettingTable props={settings.subjectDepartment} />
        </CCol>
        <CCol>
          <ShareSettingTable props={settings.major} />
        </CCol>
      </CRow>
    </>
  );
};

export default MainComponent;
