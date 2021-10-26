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
  CSelect,
  CSwitch,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import api from "src/service/api";

const MainComponent = ({ view, disableView, success, defaultForm = {} }) => {
  const [form, setForm] = useState({});
  const [update, setUpdate] = useState(false);

  const setValueForm = (path, value) => {
    let nextForm = _.cloneDeep(form);
    _.set(nextForm, path, value);
    setForm(nextForm);
  };

  const setGetForm = (getPath, setPath) => {
    return {
      value: _.get(form, getPath),
      onChange: (e) => setValueForm(getPath ?? setPath, e.target.value),
    };
  };

  const selectProps = (path) => {
    return {
      onChange: (e) => setValueForm(path, e.currentTarget.value),
    };
  };

  const submit = () => {
    if (update)
      api.patch(`/council-roles`, form).then((response) => {
        disableView();
        success(response);
      });
    else
      api.post(`/council-roles`, form).then((response) => {
        disableView();
        success(response);
      });
  };

  useEffect(() => {
    setUpdate(defaultForm && Object.keys(defaultForm).length > 0);
    if (Object.keys(defaultForm).length <= 0) {
      defaultForm.displayOrder = 1;
      defaultForm.deleted = false;
    }
    setForm(defaultForm);
  }, [defaultForm]);

  return (
    <CModal color="info" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>
          {update ? "Chỉnh sửa" : "Thêm mới"} vai trò trong hội đồng
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-3">
        {update && (
          <CRow>
            <CCol md="4">
              <CLabel>Mã vai trò</CLabel>
            </CCol>
            <CCol>{form.id}</CCol>
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
                invalid={!form.name}
                valid={form.name}
                required
                {...setGetForm("name")}
              />
              {!form.name && (
                <CInvalidFeedback>Không được để trống</CInvalidFeedback>
              )}
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="4">
              <CLabel>Số lượng thành viên</CLabel>
            </CCol>
            <CCol>
              <CSelect
                custom
                id="selectMin"
                size="sm"
                value={form.min}
                {...selectProps("min")}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </CSelect>
            </CCol>
            {"->"}
            <CCol md="4">
              <CSelect
                custom
                id="selectMax"
                size="sm"
                value={form.max}
                {...selectProps("max")}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </CSelect>
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="4">
              <CLabel>Thứ tự hiện thị</CLabel>
            </CCol>
            <CCol md="3">
              <CInput
                id="name"
                placeholder="0, 1,..."
                type="number"
                step="1"
                invalid={!form.displayOrder}
                valid={form.displayOrder}
                required
                {...setGetForm("displayOrder")}
              />
              {!form.name && (
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
                checked={!form.deleted}
                onChange={(e) =>
                  setValueForm("deleted", !e.currentTarget.checked)
                }
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
