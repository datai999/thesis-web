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
  CInputCheckbox,
  CInputRadio,
  CLabel,
  CSelect,
  CTextarea,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import api from "../../../service/api";

const TopicCreate = () => {
  const [form, setForm] = useState({
    thesis: false,
    majors: [],
    minStudentTake: 1,
    maxStudentTake: 3,
  });
  const [educationMethods, setEducationMethods] = useState([]);
  const [majors, setMajors] = useState([]);

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

  const onChangeMajors = (event) => {
    const majorId = event.currentTarget.value;
    const checked = event.currentTarget.checked;
    let nextForm = _.cloneDeep(form);
    let currentMajors = _.get(nextForm, "majors");
    let nextMajors = currentMajors;
    if (!checked && currentMajors.includes(majorId)) {
      nextMajors = currentMajors.filter((element) => element != majorId);
    }
    if (checked && !currentMajors.includes(majorId)) {
      nextMajors.push(majorId);
    }
    _.set(nextForm, "majors", nextMajors);
    setForm(nextForm);
  };

  const create = () => {
    api.create(form, "/topic");
  };

  useEffect(() => {
    api.get("/major").then(setMajors);
    api.postExample({ type: "educationMethod" }, "/const").then((response) => {
      setEducationMethods(response);
      const defaultEducationMethod = response.find(
        (educationMethod) => educationMethod.no == 0
      );
      let nextForm = _.cloneDeep(form);
      _.set(nextForm, "educationMethod", defaultEducationMethod.id);
      setForm(nextForm);
    });
  }, []);

  return (
    <CCard>
      <CCardHeader>Tạo đề tài</CCardHeader>
      <CCardBody>
        <CForm>
          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="name.vi">Tên đề tài tiếng việt</CLabel>
            </CCol>
            <CCol xs="12" md="10">
              <CInput
                id="name.vi"
                placeholder="Text"
                {...setGetForm("name.vi")}
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="name.en">Tên đề tài tiếng anh</CLabel>
            </CCol>
            <CCol xs="12" md="10">
              <CInput
                id="name.en"
                placeholder="Text"
                {...setGetForm("name.en")}
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="semester">Học kỳ</CLabel>
            </CCol>
            <CCol xs="12" md="2">
              <CSelect custom {...setGetForm("semester")}>
                <option>Chọn học kỳ</option>
                <option value="211">211</option>
                <option value="212">212</option>
                <option value="213">213</option>
              </CSelect>
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="2">
              <CLabel>Loại đề tài</CLabel>
            </CCol>
            <CCol md="9">
              <CFormGroup variant="custom-radio" inline>
                <CInputRadio
                  custom
                  id="nonThesis"
                  name="type"
                  defaultChecked={!form.thesis}
                  {...setGetForm("thesis")}
                  value={false}
                />
                <CLabel variant="custom-checkbox" htmlFor="nonThesis">
                  Đề cương
                </CLabel>
              </CFormGroup>
              <CFormGroup variant="custom-radio" inline>
                <CInputRadio
                  custom
                  id="thesis"
                  name="type"
                  defaultChecked={form.thesis}
                  {...setGetForm("thesis")}
                  value={true}
                />
                <CLabel variant="custom-checkbox" htmlFor="thesis">
                  Luận văn
                </CLabel>
              </CFormGroup>
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="2">
              <CLabel>Phương thức đào tạo</CLabel>
            </CCol>
            <CCol md="9">
              {educationMethods.map((educationMethod) => (
                <CFormGroup variant="custom-radio" inline>
                  <CInputRadio
                    custom
                    id={"educationMethod" + educationMethod.id}
                    name="eduMethod"
                    defaultChecked={educationMethod.no == 0}
                    {...setGetForm("educationMethod")}
                    value={educationMethod.id}
                  />
                  <CLabel
                    variant="custom-checkbox"
                    htmlFor={"educationMethod" + educationMethod.id}
                  >
                    {educationMethod.value?.vi}
                  </CLabel>
                </CFormGroup>
              ))}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="2">
              <CLabel>Ngành</CLabel>
            </CCol>
            <CCol md="9">
              {majors.map((major) => (
                <CFormGroup variant="custom-checkbox" inline>
                  <CInputCheckbox
                    custom
                    id={"major" + major.id}
                    name="major"
                    value={major.id}
                    onChange={onChangeMajors}
                  />
                  <CLabel
                    variant="custom-checkbox"
                    htmlFor={"major" + major.id}
                  >
                    {major.name?.vi}
                  </CLabel>
                </CFormGroup>
              ))}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="select">Số lượng sinh viên</CLabel>
            </CCol>
            <CCol xs="12" md="10">
              <CFormGroup row>
                <CCol md="3">
                  <CFormGroup row>
                    <CCol md="5">
                      <CLabel htmlFor="select">Tối thiểu</CLabel>
                    </CCol>
                    <CCol md="5">
                      <CSelect custom name="select" size="sm" id="select">
                        <option value="1" selected>
                          1
                        </option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </CSelect>
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol md="3">
                  <CFormGroup row>
                    <CCol md="5">
                      <CLabel htmlFor="select">Tối đa</CLabel>
                    </CCol>
                    <CCol md="5">
                      <CSelect custom name="select" size="sm" id="select">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3" selected>
                          3
                        </option>
                      </CSelect>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CFormGroup>
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="description">Mô tả</CLabel>
            </CCol>
            <CCol xs="12" md="10">
              <CTextarea
                id="description"
                rows="9"
                placeholder="Content..."
                {...setGetForm("description")}
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="task">Nhiệm vụ</CLabel>
            </CCol>
            <CCol xs="12" md="10">
              <CTextarea
                id="task"
                rows="9"
                placeholder="Content..."
                {...setGetForm("task")}
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="2">
              <CLabel htmlFor="documentReference">Tài liệu tham khảo</CLabel>
            </CCol>
            <CCol xs="12" md="10">
              <CTextarea
                id="documentReference"
                rows="9"
                placeholder="Content..."
                {...setGetForm("documentReference")}
              />
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
