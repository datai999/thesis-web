import CIcon from "@coreui/icons-react";
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
  CInputGroup,
  CInputGroupAppend,
  CInputGroupText,
  CInputRadio,
  CLabel,
  CSelect
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import api from "../../../service/api";

const TopicCreate = () => {
  const [form, setForm] = useState({
    male: true,
  });
  const [subjectDepartments, setSubjectDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);

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

  const create = () => {
    api.create(form, "/teachers");
  };

  useEffect(() => {
    api.get("/subject-department").then(setSubjectDepartments);
    api.get("/degree").then(setDegrees);
  }, []);

  return (
    <CCard>
      <CCardHeader>Thêm giáo viên</CCardHeader>
      <CCardBody>
        <CForm>
          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="name">Họ và tên</CLabel>
            </CCol>
            <CCol xs="12" md="10">
              <CFormGroup row>
                <CCol md="3">
                  <CInput
                    id="firstName"
                    placeholder="Nguyễn Văn"
                    {...setGetForm("firstName")}
                  />
                </CCol>
                <CCol md="2">
                  <CInput
                    id="lastName"
                    placeholder="A"
                    {...setGetForm("lastName")}
                  />
                </CCol>
              </CFormGroup>
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="code">Mã giáo viên</CLabel>
            </CCol>
            <CCol md="2">
              <CInput id="code" placeholder="text" {...setGetForm("code")} />
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="2">
              <CLabel>Giới tính</CLabel>
            </CCol>
            <CCol md="9">
              <CFormGroup variant="custom-radio" inline>
                <CInputRadio
                  custom
                  id="male"
                  name="gender"
                  defaultChecked={form.male}
                  {...setGetForm("male")}
                  value={true}
                />
                <CLabel variant="custom-checkbox" htmlFor="male">
                  Nam
                </CLabel>
              </CFormGroup>
              <CFormGroup variant="custom-radio" inline>
                <CInputRadio
                  custom
                  id="female"
                  name="gender"
                  defaultChecked={!form.male}
                  {...setGetForm("male")}
                  value={false}
                />
                <CLabel variant="custom-checkbox" htmlFor="female">
                  Nữ
                </CLabel>
              </CFormGroup>
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="email">HCMUT email</CLabel>
            </CCol>
            <CCol md="4">
              <CInputGroup>
                <CInput
                  type="email"
                  id="email"
                  placeholder="text"
                  autoComplete="name"
                  {...setGetForm("email")}
                />
                <CInputGroupAppend>
                  <CInputGroupText className={"bg-info text-white"}>
                    @hcmut.edu.vn
                  </CInputGroupText>
                </CInputGroupAppend>
              </CInputGroup>
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="phone">Số điện thoại</CLabel>
            </CCol>
            <CCol md="2">
              <CInput id="phone" placeholder="text" {...setGetForm("phone")} />
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="subjectDepartment">Phòng ban</CLabel>
            </CCol>
            <CCol xs="12" md="3">
              <CSelect custom {...setGetForm("subjectDepartment")}>
                <option>Chọn</option>
                {subjectDepartments.map((subjectDepartment) => (
                  <option value={subjectDepartment.id}>
                    {subjectDepartment.name.vi}
                  </option>
                ))}
              </CSelect>
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="degree">Học vị</CLabel>
            </CCol>
            <CCol xs="12" md="3">
              <CSelect custom {...setGetForm("degree")}>
                <option>Chọn</option>
                {degrees.map((degree) => (
                  <option value={degree.id}>{degree.name.vi}</option>
                ))}
              </CSelect>
            </CCol>
          </CFormGroup>
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" onClick={create}>
          <CIcon name="cil-scrubber" /> Submit
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default TopicCreate;
