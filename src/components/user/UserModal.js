import CIcon from "@coreui/icons-react";
import {
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CWidgetIcon,
} from "@coreui/react";
import React from "react";
import api from "src/service/api";
import { PERMISSIONS } from "src/service/permissionService";

const UserModal = ({ view, disableView, userId }) => {
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    userId && api.get(`/users/detail/${userId}`).then(setUser);
  }, [userId]);

  const leftProps = {
    md: PERMISSIONS.STUDENT === user.permission ? 5 : 4,
    className: "pr-0",
  };

  const rightProps = {
    className: "pl-0",
  };

  return (
    <CModal size="sm" show={view} onClose={disableView} style={{ width: 350 }}>
      <CModalHeader closeButton>
        <CModalTitle>{user.fullName}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CWidgetIcon
          color="dark"
          iconPadding={false}
          className="mb-0"
          header={
            <div className="text-dark" style={{ width: 210 }}>
              <small>
                <CRow>
                  <CCol {...leftProps}>Mã số :</CCol>
                  <CCol {...rightProps}>{user.code}</CCol>
                </CRow>
                <CRow>
                  <CCol {...leftProps}>Email :</CCol>
                  <CCol {...rightProps}>{user.email}</CCol>
                </CRow>
                <CRow>
                  <CCol {...leftProps}>Học vị :</CCol>
                  <CCol {...rightProps}>{`${
                    user.degreeName ?? "Sinh viên"
                  }`}</CCol>
                </CRow>
                {PERMISSIONS.STUDENT === user.permission && (
                  <>
                    <CRow>
                      <CCol {...leftProps}>Chuyên ngành :</CCol>
                      <CCol {...rightProps}>{user.majorName}</CCol>
                    </CRow>
                    <CRow>
                      <CCol {...leftProps}>Đào tạo :</CCol>
                      <CCol {...rightProps}>{user.educationMethodName}</CCol>
                    </CRow>
                  </>
                )}
                {[
                  PERMISSIONS.TEACHER,
                  PERMISSIONS.HEAD_SUBJECT_DEPARTMENT,
                ].includes(user.permission) && (
                  <>
                    <CRow>
                      <CCol {...leftProps}>Bộ môn:</CCol>
                      <CCol {...rightProps}>
                        {user.subjectDepartmentName}
                        {PERMISSIONS.HEAD_SUBJECT_DEPARTMENT ===
                          user.permission && " (trưởng bộ môn)"}
                      </CCol>
                    </CRow>
                  </>
                )}
              </small>
            </div>
          }
        >
          <CIcon width={24} name="cil-user" />
        </CWidgetIcon>
      </CModalBody>
    </CModal>
  );
};

const userModalHolder = {
  listener: (user) => {
    userModalHolder.handler(user);
  },
  handler: (user) => {
    // view user modal
  },
};

export { UserModal, userModalHolder };

export default userModalHolder.listener;
