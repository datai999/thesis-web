import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CTooltip,
  CWidgetIcon,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "src/service/api";
import { loginUserHasAny, PERMISSIONS } from "src/service/permissionService";

const MainComponent = () => {
  const canEdit = loginUserHasAny([
    PERMISSIONS.ADMIN,
    PERMISSIONS.EDUCATION_STAFF,
  ]);

  const history = useHistory();
  const userId = window.location.pathname.match(/(?:\/users\/)(\d+)/, "")[1];

  const [user, setUser] = useState({});

  useEffect(() => {
    api.get(`/users/detail/${userId}`).then(setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard style={{ minWidth: "50%", maxWidth: 600, margin: "auto" }}>
      <CCardBody>
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
                  Email:
                </CCol>
                <CCol>{user.email}</CCol>
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

        <div className="ml-5">
          {PERMISSIONS.STUDENT === user.permission && (
            <>
              <CRow>
                <CCol md="4">Chuyên ngành:</CCol>
                <CCol>{user.majorName}</CCol>
              </CRow>
              <CRow>
                <CCol md="4">Phương thức đào tạo:</CCol>
                <CCol>{user.educationMethodName}</CCol>
              </CRow>
            </>
          )}
          {[PERMISSIONS.TEACHER, PERMISSIONS.HEAD_SUBJECT_DEPARTMENT].includes(
            user.permission
          ) && (
            <>
              <CRow>
                <CCol md="4">Học vị:</CCol>
                <CCol>{user.degreeName}</CCol>
              </CRow>
              <CRow>
                <CCol md="4">Phòng ban:</CCol>
                <CCol>{user.subjectDepartmentName}</CCol>
              </CRow>
            </>
          )}
        </div>
      </CCardBody>
      {canEdit && (
        <CCardFooter>
          <CTooltip content={"Chỉnh sửa thông tin"}>
            <CButton
              color="primary"
              size="sm"
              onClick={() => history.push(`/users/${userId}/edit`)}
            >
              <CIcon name="cil-pencil" /> Chinh sửa
            </CButton>
          </CTooltip>
        </CCardFooter>
      )}
    </CCard>
  );
};

export default MainComponent;
