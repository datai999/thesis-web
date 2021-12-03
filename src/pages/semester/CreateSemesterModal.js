import {
  CButton,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInvalidFeedback,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import toastHolder from "src/service/toastService";
import api from "../../service/api";

const MainComponent = ({ view, disableView, success, defaultForm = {} }) => {
  const [form, setForm] = useState({});
  const [update, setUpdate] = useState(false);

  const submit = () => {
    if (form.id) {
      api.patch("/semesters", form).then((response) => {
        disableView();
        success(response);
        toastHolder.success("Cập nhật thông tin học kỳ thành công");
      });
    } else {
      api.post(`/semesters`, form).then((response) => {
        disableView();
        success(response);
        toastHolder.success("Tạo học kỳ thành công");
      });
    }
  };

  const setGetForm = (getPath, setPath) => {
    return {
      value: _.get(form, getPath),
      onChange: (e) => {
        let nextForm = _.cloneDeep(form);
        _.set(nextForm, getPath ?? setPath, e.target.value);
        setForm(nextForm);
      },
    };
  };

  useEffect(() => {
    setUpdate(defaultForm && Object.keys(defaultForm).length > 0);
    setForm(defaultForm);
  }, [defaultForm]);

  return (
    <CModal color="info" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>{update ? "Chỉnh sửa" : "Thêm mới"} học kỳ</CModalTitle>
      </CModalHeader>
      <CModalBody className="px-3">
        {update && (
          <CRow>
            <CCol md="4">
              <CLabel>Mã học kỳ</CLabel>
            </CCol>
            <CCol>{form.id}</CCol>
          </CRow>
        )}

        <CForm>
          <CFormGroup row>
            <CCol md="4">
              <CLabel htmlFor="name">Học kỳ</CLabel>
            </CCol>
            <CCol>
              <CInput
                id="name"
                placeholder="211, 212, 213, ..."
                invalid={!form.name}
                valid={form.name}
                required
                {...setGetForm("name")}
              />
              {!form.name && (
                <CInvalidFeedback>Học kỳ không được để trống</CInvalidFeedback>
              )}
            </CCol>
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="startTime">Sinh viên đăng kí đề tài</CLabel>
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
            <CLabel htmlFor="startTime">Làm đề cương luận văn</CLabel>
            <CRow>
              <CCol>
                <CInput type="datetime-local" {...setGetForm("topicStart")} />
              </CCol>
              <CCol md="0 mt-2">{"-->"}</CCol>
              <CCol>
                <CInput type="datetime-local" {...setGetForm("topicEnd")} />
              </CCol>
            </CRow>
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="startTime">Làm luận văn</CLabel>
            <CRow>
              <CCol>
                <CInput type="datetime-local" {...setGetForm("thesisStart")} />
              </CCol>
              <CCol md="0 mt-2">{"-->"}</CCol>
              <CCol>
                <CInput type="datetime-local" {...setGetForm("thesisEnd")} />
              </CCol>
            </CRow>
          </CFormGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="info" onClick={submit}>
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
