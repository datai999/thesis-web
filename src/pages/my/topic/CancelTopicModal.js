import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow
} from "@coreui/react";
import React from "react";
import api from "src/service/api";

const MainComponent = ({ view, disableView, confirm, topic }) => {
  const registerTopic = () => {
    api.delete(`/topics/${topic.id}/students/cancel`).then((response) => {
      confirm(response.data);
    });
    disableView();
  };

  if (!topic) return null;
  return (
    <CModal color="warning" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Xác nhận hủy đăng ký đề tài</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <center>
          <h5>{topic.names && topic.names[0]}</h5>
          <h5>{topic.names && topic.names[1]}</h5>
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
          <CCol>
            {topic.guideTeachers?.map((guideTeacher) => (
              <tr>
                {guideTeacher.code} {guideTeacher.firstName}{" "}
                {guideTeacher.lastName}
              </tr>
            ))}
          </CCol>
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
