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
  CSwitch
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import api from "src/service/api";

const MainComponent = ({
  view,
  disableView,
  success,
  defaultForm = {},
  ...props
}) => {
  const [name, setName] = useState(null);
  const [deleted, setDeleted] = useState(true);
  const [update, setUpdate] = useState(false);

  const submitSuccess = (response) => {
    setName(null);
    setUpdate(false);
    disableView();
    success(response);
  };

  const submit = () => {
    const form = { id: defaultForm.id, name, deleted };
    if (update) api.patch(`${props.baseURL}`, form).then(submitSuccess);
    else api.post(`${props.baseURL}`, form).then(submitSuccess);
  };

  useEffect(() => {
    setUpdate(defaultForm && Object.keys(defaultForm).length > 0);
    if (Object.keys(defaultForm).length > 0) {
      setDeleted(defaultForm.deleted);
    }
    setName(defaultForm.name);
  }, [defaultForm]);

  return (
    <CModal color="info" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>
          {update ? "Chỉnh sửa" : "Thêm mới"} {props.headerTitle}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-3">
        {update && (
          <CRow>
            <CCol md="4">
              <CLabel>Mã vai trò</CLabel>
            </CCol>
            <CCol>{defaultForm.id}</CCol>
          </CRow>
        )}

        <CForm>
          <CFormGroup row>
            <CCol md="4">
              <CLabel htmlFor="name">Tên vai trò</CLabel>
            </CCol>
            <CCol>
              <CInput
                id="name"
                invalid={!name}
                valid={name !== null && name !== undefined}
                required
                defaultValue={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              {!name && (
                <CInvalidFeedback>Không được để trống</CInvalidFeedback>
              )}
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="4">
              <CLabel>Sử dụng</CLabel>
            </CCol>
            <CCol md="3">
              <CSwitch
                color="primary"
                labelOn={"\u2713"}
                labelOff={"\u2715"}
                checked={!deleted}
                onChange={(e) => setDeleted(!e.currentTarget.checked)}
              />
            </CCol>
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
