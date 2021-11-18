import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCardBody,
  CCol,
  CRow,
  CTooltip,
} from "@coreui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import api from "src/service/api";
import context from "src/service/contextService";
import { loginUserHasAny, PERMISSIONS } from "src/service/permissionService";

const MainComponent = ({ item, setTopicRegister, setRegisterTopicModal }) => {
  const canViewScore = loginUserHasAny([
    PERMISSIONS.EDUCATION_STAFF,
    PERMISSIONS.TEACHER,
    PERMISSIONS.HEAD_SUBJECT_DEPARTMENT,
  ]);
  const history = useHistory();

  const [canRegister, setCanRegister] = React.useState(false);

  React.useEffect(() => {
    if (
      loginUserHasAny([PERMISSIONS.STUDENT]) &&
      item.semester.id === context.semester.id
    )
      api.get(`/semesters/allow-student-register-cancel`).then(setCanRegister);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCardBody>
      <CRow>
        <CCol md="5">
          Mô tả
          <br></br>
          {item.description}
        </CCol>
        <CCol md="5">
          Nhiệm vụ
          <br></br>
          {item.task}
          <br></br>
          Tài liệu
          <br></br>
          {item.documentReference}
        </CCol>
        <CCol>
          Sinh viên:
          <br></br>
          {[...Array(item.maxStudentTake).keys()].map((index) => (
            <div>
              {item.students && item.students[index] ? (
                <div>
                  <CRow>
                    <CCol>{item.students[index].firstName}</CCol>
                  </CRow>
                  <CRow>
                    <CCol>{item.students[index].lastName}</CCol>
                    <CCol>{item.students[index].code}</CCol>
                  </CRow>
                </div>
              ) : (
                canRegister && (
                  <CButton
                    type="button"
                    color="info"
                    size="sm"
                    onClick={() => {
                      setTopicRegister(item);
                      setRegisterTopicModal(true);
                    }}
                  >
                    Đăng ký
                  </CButton>
                )
              )}
              <br></br>
            </div>
          ))}
        </CCol>
        <td>
          {canViewScore && (
            <CButtonGroup vertical size="sm">
              <CTooltip content={"Bảng điểm"}>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => {
                    history.push(`/score/topic/${item.id}`);
                  }}
                >
                  <CIcon name="cil-calculator" />
                </CButton>
              </CTooltip>
            </CButtonGroup>
          )}
        </td>
      </CRow>
    </CCardBody>
  );
};

export default MainComponent;
