import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React from "react";
import api from "../../../service/api";

const MainComponent = ({ view, disableView, topic }) => {
  const registerTopic = () => {
    api.post(`/topics/${topic.id}/student-register`).then(disableView);
  };

  if (!topic) return null;
  return (
    <CModal color="warning" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Đăng ký đề tài</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <center>
          <h5>{topic.name?.vi}</h5>
          <h5>{topic.name?.en}</h5>
        </center>

        <br></br>

        <CRow>
          <CCol md="2">Đào tạo:</CCol>
          <CCol>{multiLine(topic.educationMethodNames)}</CCol>
          <CCol md="2">Ngành:</CCol>
          <CCol>{multiLine(topic.majorNames)}</CCol>
        </CRow>
        <br></br>

        <CRow>
          <CCol md="4">Giáo viên hướng dẫn:</CCol>
          <CCol>{multiLine(topic.guideTeacherCodeNames)}</CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="info" onClick={registerTopic}>
          Xác nhận
        </CButton>
        <CButton color="secondary" onClick={disableView}>
          Quay về
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const multiLine = (array) => (
  <td>
    {array?.map((e) => (
      <tr>{e}</tr>
    ))}
  </td>
);

export default MainComponent;
