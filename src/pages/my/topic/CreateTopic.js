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
import { useHistory } from "react-router-dom";
import UserCard from "src/components/UserCard";
import TeacherSearchModal from "src/pages/teacher/TeacherSearchModal";
import api from "src/service/api";
import contextHolder from "src/service/contextService";

const TopicCreate = ({ location }) => {
  const history = useHistory();
  const [form, setForm] = useState({
    // thesis: false,
    educationMethods: [],
    majors: [],
    minStudentTake: 1,
    maxStudentTake: 3,
    documentReference: "Liên hệ GVHD",
  });
  const [thesis, setThesis] = useState(false);
  const [guideTeachers, setGuideTeachers] = useState([]);
  const [searchTeachers, setSearchTeachers] = useState(false);

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
    const id = parseInt(event.currentTarget.value);
    let current = _.get(form, path);
    if (current.includes(id)) {
      current = current.filter((element) => element !== id);
    } else {
      current.push(id);
    }
    setValueForm(path, current);
  };

  const selectProps = (path) => {
    return {
      onChange: (e) => setValueForm(path, e.currentTarget.value),
    };
  };

  const create = () => {
    form.thesis = thesis;
    form.semester = contextHolder.semester;
    form.guideTeachers = guideTeachers;
    if (form.id) {
      api
        .patch("/topics", form)
        .then((response) => response && history.push(`/my/topics/guide`));
    } else {
      api
        .post("/topics", form)
        .then((response) => response && history.push(`/my/topics/guide`));
    }
  };

  const removeGuideTeacher = (teacher) => {
    setGuideTeachers(guideTeachers.filter((e) => e !== teacher));
  };

  useEffect(() => {
    if (location?.state) {
      const exitTopic = location.state;
      exitTopic.educationMethods = exitTopic.educationMethods.map((e) => e.id);
      exitTopic.majors = exitTopic.majors.map((e) => e.id);
      setForm(exitTopic);
      setThesis(exitTopic.thesis);
      setGuideTeachers(location.state.guideTeachers);
    } else api.get("/users/token").then((user) => setGuideTeachers([user]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <TeacherSearchModal
        view={searchTeachers}
        disableView={() => setSearchTeachers(false)}
        selected={(teacher) => {
          setSearchTeachers(false);
          setGuideTeachers([...guideTeachers, teacher]);
        }}
        removeLoginUser={true}
      />
      <CCardHeader>
        <h5>{form.id ? `Chỉnh sửa đề tài` : "Tạo đề tài"}</h5>
      </CCardHeader>
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
                <CCol md="4">
                  <CLabel>Loại đề tài</CLabel>
                  <CFormGroup variant="custom-radio">
                    <CInputRadio
                      custom
                      id="nonThesis"
                      name="type"
                      checked={!thesis}
                      value={false}
                      onChange={() => setThesis(false)}
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
                      checked={thesis}
                      onChange={() => setThesis(true)}
                      value={true}
                    />
                    <CLabel variant="custom-checkbox" htmlFor="thesis">
                      Luận văn
                    </CLabel>
                  </CFormGroup>
                </CCol>
                <CCol md="5">
                  <CLabel>Phương thức đào tạo</CLabel>
                  {contextHolder.educationMethods.map((educationMethod) => (
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
                        checked={form.educationMethods?.some(
                          (e) => e === educationMethod.id
                        )}
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
                <CCol xs="12" md="5">
                  <CLabel>Ngành</CLabel>
                  {contextHolder.majors.map((major) => (
                    <CFormGroup key={major.id} variant="custom-checkbox">
                      <CInputCheckbox
                        custom
                        id={"major" + major.id}
                        name="major"
                        value={major.id}
                        onChange={(event) => onChangeCheck(event, "majors")}
                        checked={form.majors.some((e) => e === major.id)}
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
                <CCol xs="12" md="6">
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
                        value={form.minStudentTake}
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
                        value={form.maxStudentTake}
                        {...selectProps("maxStudentTake")}
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </CSelect>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CFormGroup>
            </CCol>

            <CCol md="6">
              <CLabel>Giáo viên hướng dẫn</CLabel>
              <CFormGroup row>
                <CCol md="6">
                  <UserCard user={guideTeachers[0]} />
                </CCol>
              </CFormGroup>
              <CLabel>Giáo viên đồng hướng dẫn</CLabel>
              <CFormGroup row>
                {guideTeachers.slice(1, 3).map((guideTeacher, index) => (
                  <CCol key={index} md="6">
                    <UserCard
                      user={guideTeacher}
                      remove={() => removeGuideTeacher(guideTeacher)}
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
          <CIcon name="cil-save" /> Lưu
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default TopicCreate;
