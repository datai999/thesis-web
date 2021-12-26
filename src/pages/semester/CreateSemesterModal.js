import {
  CButton,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInputRadio,
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
  const [form, setForm] = useState(defaultForm);

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

  const setValueForm = (path, value) => {
    let nextForm = _.cloneDeep(form);
    _.set(nextForm, path, value);
    setForm(nextForm);
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
    setForm(
      Object.keys(defaultForm).length > 0 ? defaultForm : { defaultMid: true }
    );
  }, [defaultForm]);

  return (
    <CModal color="info" size="lg" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>
          {form.id ? `Chỉnh sửa học kỳ mã số ${form.id}` : "Thêm học kỳ mới"}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-3">
        <CForm>
          <CFormGroup row>
            <CCol md="0" className="ml-3 mt-2">
              <CLabel htmlFor="name">
                <strong>Tên học kỳ</strong>
              </CLabel>
            </CCol>
            <CCol md="2">
              <CInput
                id="name"
                placeholder="211, 212, 213, ..."
                // invalid={!form.name}
                valid={form.name}
                // required
                {...setGetForm("name")}
              />
              {!form.name && (
                <CInvalidFeedback>Học kỳ không được để trống</CInvalidFeedback>
              )}
            </CCol>
          </CFormGroup>

          <CRow>
            <CCol>
              <h5>
                <strong>Đề cương</strong>
              </h5>
              <div className="border m-0 p-2">
                <SemesterProperty
                  setValueForm={setValueForm}
                  setGetForm={setGetForm}
                  defaultMid={true}
                />
              </div>
            </CCol>
            <CCol>
              <h5>
                <strong>Luận văn</strong>
              </h5>
              <div className="border m-0 p-2">
                <SemesterProperty
                  setValueForm={setValueForm}
                  setGetForm={setGetForm}
                  defaultMid={true}
                />
              </div>
            </CCol>
          </CRow>
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

const SemesterProperty = ({ setValueForm, setGetForm, defaultMid }) => {
  return (
    <>
      <CRow>
        <CCol md="0" className="ml-3">
          <CLabel>
            <strong>Kết quả giữa kỳ ban đầu</strong>
          </CLabel>
        </CCol>
        <CFormGroup variant="custom-radio" className="ml-3">
          <CInputRadio
            custom
            id="pass"
            name="defaultMid"
            checked={defaultMid}
            onChange={() => setValueForm("defaultMid", true)}
          />
          <CLabel variant="custom-checkbox" htmlFor="pass">
            Đạt
          </CLabel>
        </CFormGroup>
        <CFormGroup variant="custom-radio" className="ml-2">
          <CInputRadio
            custom
            id="fail"
            name="defaultMid"
            checked={!defaultMid}
            onChange={() => setValueForm("defaultMid", false)}
          />
          <CLabel variant="custom-checkbox" htmlFor="fail">
            Không đạt
          </CLabel>
        </CFormGroup>
      </CRow>

      <div className="border px-2 pt-2">
        <CFormGroup>
          <CLabel htmlFor="startTime">
            <strong>Giáo viên ra đề tài</strong>
          </CLabel>
          <CRow>
            <CCol>
              <CInput
                type="datetime-local"
                {...setGetForm("createTopicStart")}
              />
            </CCol>
            <CCol md="0 mt-2">{"-->"}</CCol>
            <CCol>
              <CInput type="datetime-local" {...setGetForm("createTopicEnd")} />
            </CCol>
          </CRow>
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="startTime">
            <strong>Giáo viên đánh giá giữa kỳ</strong>
          </CLabel>
          <CRow>
            <CCol>
              <CInput type="datetime-local" {...setGetForm("midMarkStart")} />
            </CCol>
            <CCol md="0 mt-2">{"-->"}</CCol>
            <CCol>
              <CInput type="datetime-local" {...setGetForm("midMarkEnd")} />
            </CCol>
          </CRow>
        </CFormGroup>
      </div>

      <br />

      <div className="border px-2 pt-2">
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
            <strong>Sinh viên hiện thực</strong>
          </CLabel>
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
      </div>
    </>
  );
};

export default MainComponent;
