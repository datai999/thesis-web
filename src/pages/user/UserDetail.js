import CIcon from "@coreui/icons-react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetIcon,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import api from "src/service/api";

const MainComponent = () => {
  const userId = window.location.pathname.match(/(?:\/users\/)(\d+)/, "")[1];

  const [user, setUser] = useState({});

  useEffect(() => {
    api.get(`/users/detail/${userId}`).then(setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard style={{ minWidth: "50%", maxWidth: 600, margin: "auto" }}>
      <CCardHeader>
        <CWidgetIcon
          color="gradient-info"
          iconPadding={false}
          header={
            <div style={{ minWidth: window.screen.width / 3.5, maxWidth: 450 }}>
              <CRow>
                <CCol md="3" className="pl-3">
                  Mã số:
                </CCol>
                <CCol>{user.code}</CCol>
              </CRow>
              <CRow>
                <CCol md="3" className="pl-3">
                  Họ và tên:
                </CCol>
                <CCol>
                  {user.firstName} {user.lastName}
                </CCol>
              </CRow>
              <CRow>
                <CCol md="3" className="pl-3">
                  Giới tính:
                </CCol>
                <CCol>{user.gender}</CCol>
              </CRow>
            </div>
          }
        >
          <CIcon width={48} name="cil-user" />
        </CWidgetIcon>
      </CCardHeader>
      <CCardBody>
        <div className="mx-5">
          {user.type === "TEACHER" ? (
            <>
              <CRow>
                <CCol md="3">Học vị:</CCol>
                <CCol>{user.degreeName}</CCol>
              </CRow>
              <CRow>
                <CCol md="3">Phòng ban:</CCol>
                <CCol>{user.subjectDepartmentName}</CCol>
              </CRow>
            </>
          ) : (
            <>
              <CRow>
                <CCol md="3">Chuyên ngành:</CCol>
                <CCol>{user.majorName}</CCol>
              </CRow>
              <CRow>
                <CCol md="3">Phương thức đào tạo:</CCol>
                <CCol>{user.educationMethodName}</CCol>
              </CRow>
            </>
          )}

          <CRow>
            <CCol md="3">Email:</CCol>
            <CCol>{user.email}</CCol>
          </CRow>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
