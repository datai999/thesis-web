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
  CTextarea
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../service/api";
import TeacherSearchModal from "../teacher/TeacherSearchModal";

const TeacherCard = ({ teacher, remove }) => {
  if (!teacher) return;
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
        {teacher.email}
      </CCardBody>
    </CCard>
  );
};

const TopicCreate = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    thesis: false,
    semester: null,
    educationMethods: [],
    majors: [],
    minStudentTake: 1,
    maxStudentTake: 3,
  });
  const [educationMethods, setEducationMethods] = useState([]);
  const [majors, setMajors] = useState([]);
  const [guideTeachers, setGuideTeachers] = useState([]);
  const [searchTeachers, setSearchTeachers] = useState(false);
  const [currentSemester, setCurrentSemester] = useState();

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

  const onChangeCheck = (event, path) => {
    const id = event.currentTarget.value;
    const checked = event.currentTarget.checked;
    let current = _.get(form, path);
    let next = current;
    if (!checked && current.includes(id)) {
      next = current.filter((element) => element !== id);
    }
    if (checked && !current.includes(id)) {
      next.push(id);
    }
    setValueForm(path, next);
  };

  const selectProps = (path) => {
    return {
      onChange: (e) => setValueForm(path, e.currentTarget.value),
    };
  };

  const create = () => {
    form.guideTeachers = guideTeachers;
    form.semester = currentSemester;
    api
      .post("/topics", form)
      .then((response) => response && history.push(`/my/topics/guide`));
  };

  const removeGuideTeacher = (teacher) => {
    setGuideTeachers(guideTeachers.filter((e) => e !== teacher));
  };

  useEffect(() => {
    api.get("/semesters/current").then(setCurrentSemester);
    api.get("/users/token").then((user) => setGuideTeachers([user]));
    api.get("/majors").then(setMajors);
    api.get("/education-methods").then(setEducationMethods);
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
                    <CFormGroup
                      key={educationMethod.id}
                      variant="custom-checkbox"
                    >
                      <CInputCheckbox
                        custom
                        id={"educationMethod" + educationMethod.id}
                        name="educationMethod"
                        value={educationMethod.id}
                        onChange={(event) =>
                          onChangeCheck(event, "educationMethods")
                        }
                      />
                      <CLabel
                        variant="custom-checkbox"
                        htmlFor={"educationMethod" + educationMethod.id}
                      >
                        {educationMethod.name}
                      </CLabel>
                    </CFormGroup>
                  ))}
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol xs="12" md="4">
                  <CLabel>Ngành</CLabel>
                  {majors.map((major) => (
                    <CFormGroup key={major.id} variant="custom-checkbox">
                      <CInputCheckbox
                        custom
                        id={"major" + major.id}
                        name="major"
                        value={major.id}
                        onChange={(event) => onChangeCheck(event, "majors")}
                      />
                      <CLabel
                        variant="custom-checkbox"
                        htmlFor={"major" + major.id}
                      >
                        {major.name}
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
                      <CSelect
                        custom
                        id="selectMin"
                        size="sm"
                        defaultValue={form.minStudentTake}
                        {...selectProps("minStudentTake")}
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                      </CSelect>
                    </CCol>
                    <CCol md="6">
                      <CLabel htmlFor="selectMax">Tối đa</CLabel>
                    </CCol>
                    <CCol md="6">
                      <CSelect
                        custom
                        id="selectMax"
                        size="sm"
                        defaultValue={form.maxStudentTake}
                        {...selectProps("maxStudentTake")}
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
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
                  <CCol key={index} md="4">
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
