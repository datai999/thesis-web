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
    CRow
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import api from "../../service/api";

const MainComponent = ({ view, disableView, success, defaultForm = {} }) => {
  const [form, setForm] = useState({});
  const [update, setUpdate] = useState(false);

  const register = () => {
    api.post(`/semesters`, form).then((response) => {
      disableView();
      success(response);
    });
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
      <CModalBody className="px-5">
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
            <CLabel htmlFor="startTime">Thời gian đăng kí đề tài</CLabel>
            <CRow>
              <CCol md="4">
                <CLabel htmlFor="date-input">Bắt đầu</CLabel>
              </CCol>
              <CCol>
                <CInput
                  type="datetime-local"
                  id="startTime"
                  placeholder="date"
                  {...setGetForm("registerTopicStart")}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md="4">
                <CLabel htmlFor="endTime">Kết thúc</CLabel>
              </CCol>
              <CCol>
                <CInput
                  type="datetime-local"
                  id="endTime"
                  placeholder="date"
                  {...setGetForm("registerTopicEnd")}
                />
              </CCol>
            </CRow>
          </CFormGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="info" onClick={register}>
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
