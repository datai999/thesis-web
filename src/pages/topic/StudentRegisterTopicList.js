import { CButton, CCardBody, CCol, CRow } from "@coreui/react";
import React from "react";

const MainComponent = ({ item, setTopicRegister, setRegisterTopicModal }) => {
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
              )}
              <br></br>
            </div>
          ))}
        </CCol>
      </CRow>
    </CCardBody>
  );
};

export default MainComponent;
