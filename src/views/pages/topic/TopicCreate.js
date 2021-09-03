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
  CLink,
  CSelect,
  CTextarea,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../service/api";
import TeacherSearchModal from "../teacher/TeacherSearchModal";

const defaultTeacher = {
  id: 1,
  firstName: "Nguyễn Đức Anh",
  lastName: "Tài",
  email: "defaultMail",
  code: "teacherCode",
};

const TeacherCard = ({ teacher, remove }) => {
  return (
    <CCard>
      <CCardHeader>
        {teacher.code}
        <div className="card-header-actions">
          {remove && (
            <CLink
              className="card-header-action"
              onClick={() => remove(teacher)}
            >
              <CIcon name="cil-x-circle" />
            </CLink>
          )}
        </div>
      </CCardHeader>
      <CCardBody>
        {teacher.firstName}
        <br></br>
        {teacher.lastName}
        <br></br>
        <br></br>
        {teacher.email}
        <br></br>
        @hcmut.edu.vn
      </CCardBody>
    </CCard>
  );
};

const TopicCreate = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    thesis: false,
    semester: 211,
    majors: [],
    minStudentTake: 1,
    maxStudentTake: 3,
  });
  const [educationMethods, setEducationMethods] = useState([]);
  const [majors, setMajors] = useState([]);
  const [guideTeachers, setGuideTeachers] = useState([defaultTeacher]);
  const [searchTeachers, setSearchTeachers] = useState(false);

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
    form.guideTeachers = guideTeachers;
    console.log(`/topics/${form.thesis ? "thesis" : "outline"}`);
    api
      .create(form, "/topics")
      .then(
        (response) =>
          response &&
          history.push(`/topics/${form.thesis ? "thesis" : "outline"}`)
      );
  };

  const removeGuideTeacher = (teacher) => {
    setGuideTeachers(guideTeachers.filter((e) => e != teacher));
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
      <TeacherSearchModal
        view={searchTeachers}
        setView={() => setSearchTeachers(false)}
        selected={(teacher) => {
          setSearchTeachers(false);
          setGuideTeachers([...guideTeachers, teacher]);
        }}
      />
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
              <CLabel>Giáo viên hướng dẫn</CLabel>
              <CFormGroup row>
                {guideTeachers.map((guideTeacher, index) => (
                  <CCol md="4">
                    <TeacherCard
                      teacher={guideTeacher}
                      remove={index > 0 && removeGuideTeacher}
                    />
                  </CCol>
                ))}
                {guideTeachers.length < 3 && (
                  <CCol md="4">
                    <CButton
                      type="button"
                      color="info"
                      onClick={() => setSearchTeachers(true)}
                    >
                      Thêm giáo viên
                    </CButton>
                  </CCol>
                )}
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
