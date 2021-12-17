import {
  CButton,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import _ from "lodash";
import React from "react";
import api from "src/service/api";
import contextHolder from "src/service/contextService";
import toastHolder from "src/service/toastService";

const MainComponent = ({ view, disableView, ...props }) => {
  const semester = props.semester ?? {};

  const setCurrentSemester = () =>
    api.put(`/semesters/current?id=${semester.id}`).then(async () => {
      await contextHolder.refreshSemester();
      disableView();
      toastHolder.success("Chuyển tiếp học kỳ thành công");
      props.success();
    });

  const setGetForm = (getPath) => {
    return {
      value: _.get(semester, getPath),
    };
  };

  return (
    <CModal color="warning" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Xác nhận chuyển sang học kỳ mới</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <CRow className="mb-1">
            <CCol md="0" className="pl-3">
              <strong>Học kỳ:</strong>
            </CCol>
            <CCol>{semester.name}</CCol>
          </CRow>

          <br />

          <CForm>
            <fieldset disabled="disabled">
              <CFormGroup>
                <CLabel htmlFor="startTime">
                  <strong>Sinh viên đăng kí đề tài</strong>
                </CLabel>
                <CRow>
                  <CCol>
                    <CInput
                      type="datetime-local"
                      {...setGetForm("registerTopicStart")}
                    />
                  </CCol>
                  <CCol md="0 mt-2">{"-->"}</CCol>
                  <CCol>
                    <CInput
                      type="datetime-local"
                      {...setGetForm("registerTopicEnd")}
                    />
                  </CCol>
                </CRow>
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="startTime">
                  <strong>Làm đề cương luận văn</strong>
                </CLabel>
                <CRow>
                  <CCol>
                    <CInput
                      type="datetime-local"
                      {...setGetForm("topicStart")}
                    />
                  </CCol>
                  <CCol md="0 mt-2">{"-->"}</CCol>
                  <CCol>
                    <CInput type="datetime-local" {...setGetForm("topicEnd")} />
                  </CCol>
                </CRow>
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="startTime">
                  <strong>Làm luận văn</strong>
                </CLabel>
                <CRow>
                  <CCol>
                    <CInput
                      type="datetime-local"
                      {...setGetForm("thesisStart")}
                    />
                  </CCol>
                  <CCol md="0 mt-2">{"-->"}</CCol>
                  <CCol>
                    <CInput
                      type="datetime-local"
                      {...setGetForm("thesisEnd")}
                    />
                  </CCol>
                </CRow>
              </CFormGroup>
            </fieldset>
          </CForm>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="info" onClick={setCurrentSemester}>
          Xác nhận
        </CButton>
        <CButton color="secondary" onClick={disableView}>
          Quay về
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MainComponent;
