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
import api from "src/service/api";
import context from "src/service/contextService";
import toastService from "src/service/toastService";

const MainComponent = ({ view, disableView, confirm, topic }) => {
  const registerTopic = () => {
    api
      .post(`/students/${context.user.id}/topic-register`, null, {
        params: { topicId: topic.id },
      })
      .then((response) => {
        confirm(response.data);
        toastService.success("Đăng ký đề tài thành công");
      });
    disableView();
  };

  if (!topic) return null;
  return (
    <CModal color="warning" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Đăng ký đề tài</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <center>
          <h5>{topic.names && topic.names[0]}</h5>
          <h5>{topic.names && topic.names[1]}</h5>
        </center>

        <div className="ml-4 pl-4">
          <CRow className="mb-1">
            <CCol md="0">Mã số:</CCol>
            <CCol>{topic.id}</CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol md="0">Bộ môn:</CCol>
            <CCol>{topic.subjectDepartmentName}</CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol md="0">Giáo viên hướng dẫn:</CCol>
            <CCol>
              {topic.guideTeachers?.map((guideTeacher) => (
                <tr>
                  {guideTeacher.code} {guideTeacher.firstName}{" "}
                  {guideTeacher.lastName}
                </tr>
              ))}
            </CCol>
          </CRow>
        </div>
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
