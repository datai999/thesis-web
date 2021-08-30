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
  CInputGroup,
  CInputGroupPrepend,
  CInputRadio,
  CLabel,
  CLink,
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
            <CCol>
              <CLabel htmlFor="name.vi">Tên đề tài tiếng việt</CLabel>
              <CInput
                id="name.vi"
                placeholder="Text"
                {...setGetForm("name.vi")}
              />
            </CCol>
            <CCol>
              <CLabel htmlFor="name.en">Tên đề tài tiếng anh</CLabel>
              <CInput
                id="name.en"
                placeholder="Text"
                {...setGetForm("name.en")}
              />
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="6">
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="semester">Học kỳ</CLabel>
                  <CSelect custom {...setGetForm("semester")}>
                    <option>Chọn</option>
                    <option value="211">211</option>
                    <option value="212">212</option>
                    <option value="213">213</option>
                  </CSelect>
                </CCol>
                <CCol md="3">
                  <CLabel>Loại đề tài</CLabel>
                  <CFormGroup variant="custom-radio">
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
                <CCol md="5">
                  <CLabel>Phương thức đào tạo</CLabel>
                  {educationMethods.map((educationMethod) => (
                    <CFormGroup variant="custom-radio">
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
                <CCol xs="12" md="4">
                  <CLabel>Ngành</CLabel>
                  {majors.map((major) => (
                    <CFormGroup variant="custom-checkbox">
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
                <CCol xs="12" md="4">
                  <CLabel htmlFor="select">Số lượng sinh viên</CLabel>

                  <CFormGroup row>
                    <CCol md="6">
                      <CLabel htmlFor="selectMin">Tối thiểu</CLabel>
                    </CCol>
                    <CCol md="6">
                      <CSelect custom id="selectMin" size="sm" id="select">
                        <option value="1" selected>
                          1
                        </option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </CSelect>
                    </CCol>
                    <CCol md="6">
                      <CLabel htmlFor="selectMax">Tối đa</CLabel>
                    </CCol>
                    <CCol md="6">
                      <CSelect custom id="selectMax" size="sm" id="select">
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

            <CCol md="6">
              <CFormGroup row>
                <CCol md="4">
                  <CLabel>Giáo viên hướng dẫn</CLabel>
                </CCol>
                <CCol>
                  <CInputGroup>
                    <CInput placeholder="Nhập code hoặc tên giáo viên" />
                    <CInputGroupPrepend>
                      <CButton size="sm" type="button" color="info">
                        <CIcon name="cil-magnifying-glass" /> Tìm kiếm
                      </CButton>
                    </CInputGroupPrepend>
                  </CInputGroup>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="4">
                  <CCard>
                    <CCardHeader>
                      Nguyễn Đức Anh Tài
                      <div className="card-header-actions">
                        <CLink className="card-header-action">
                          <CIcon name="cil-settings" />
                        </CLink>
                        <CLink className="card-header-action">
                          <CIcon name="cil-x-circle" />
                        </CLink>
                      </div>
                    </CCardHeader>
                    <CCardBody>Email: Code:</CCardBody>
                  </CCard>
                </CCol>
                <CCol md="4">
                  <CCard>
                    <CCardHeader>
                      Nguyễn Đức Anh Tài
                      <div className="card-header-actions">
                        <CLink className="card-header-action">
                          <CIcon name="cil-settings" />
                        </CLink>
                        <CLink className="card-header-action">
                          <CIcon name="cil-x-circle" />
                        </CLink>
                      </div>
                    </CCardHeader>
                    <CCardBody>Email: Code:</CCardBody>
                  </CCard>
                </CCol>
                <CCol md="4">
                  <CCard>
                    <CCardHeader>
                      Nguyễn Đức Anh Tài
                      <div className="card-header-actions">
                        <CLink className="card-header-action">
                          <CIcon name="cil-settings" />
                        </CLink>
                        <CLink className="card-header-action">
                          <CIcon name="cil-x-circle" />
                        </CLink>
                      </div>
                    </CCardHeader>
                    <CCardBody>Email: Code:</CCardBody>
                  </CCard>
                </CCol>
              </CFormGroup>
            </CCol>
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="description">Mô tả</CLabel>
            <CTextarea
              id="description"
              rows="9"
              placeholder="Content..."
              {...setGetForm("description")}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="task">Nhiệm vụ</CLabel>
            <CTextarea
              id="task"
              rows="9"
              placeholder="Content..."
              {...setGetForm("task")}
            />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="documentReference">Tài liệu tham khảo</CLabel>
            <CTextarea
              id="documentReference"
              rows="5"
              placeholder="Content..."
              {...setGetForm("documentReference")}
            />
          </CFormGroup>
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" color="info" onClick={create}>
          <CIcon name="cil-scrubber" /> Lưu
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default TopicCreate;
