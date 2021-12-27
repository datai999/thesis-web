import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInvalidFeedback,
  CLabel,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "src/service/api";
import toastHolder from "src/service/toastService";
import SemesterType from "./SemesterType";

const MainComponent = ({ defaultForm = {} }) => {
  const history = useHistory();
  const semesterId = window.location.pathname.split("/").pop();
  const [form, setForm] = useState(defaultForm);
  const [refresh, setRefresh] = React.useState(false);

  const submit = () => {
    if (form.id) {
      api.patch("/semesters", form).then((response) => {
        setRefresh();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        toastHolder.success("Cập nhật thông tin học kỳ thành công");
      });
    } else {
      api.post(`/semesters`, form).then((response) => {
        history.push(`/semesters`);
        toastHolder.success("Tạo học kỳ thành công");
      });
    }
  };

  const setValueForm = (path, value) => {
    if (form?.status === "USED") return;
    let nextForm = _.cloneDeep(form);
    _.set(nextForm, path, value);
    setForm(nextForm);
  };

  const setGetForm = (getPath, setPath) => {
    return {
      value: _.get(form, getPath),
      onChange: (e) => {
        if (form?.status === "USED") return;
        let nextForm = _.cloneDeep(form);
        _.set(nextForm, getPath ?? setPath, e.target.value);
        setForm(nextForm);
      },
    };
  };

  useEffect(() => {
    semesterId !== "create" &&
      api.get(`/semesters/detail/${semesterId}`).then(setForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <CCard>
      <CCardHeader>
        <h4>
          <strong>
            {form.id ? `Học kỳ ${form.name} mã số ${form.id}` : "Tạo kỳ mới"}
          </strong>
        </h4>
      </CCardHeader>
      <CCardBody className="px-3">
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

          <SemesterType
            form={form}
            thesis={false}
            setValueForm={setValueForm}
            setGetForm={setGetForm}
          />
          <br />
          <SemesterType
            form={form}
            thesis={true}
            setValueForm={setValueForm}
            setGetForm={setGetForm}
          />
        </CForm>
      </CCardBody>

      {form?.status !== "USED" && (
        <CCardFooter>
          <CButton color="primary" onClick={submit}>
            Cập nhật học kỳ
          </CButton>
        </CCardFooter>
      )}
    </CCard>
  );
};

export default MainComponent;
