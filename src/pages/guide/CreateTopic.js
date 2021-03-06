import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
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
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import StudentSearchModal from "src/components/user/StudentSearchModal";
import TeacherSearchModal from "src/components/user/TeacherSearchModal";
import UserCard from "src/components/UserCard";
import api from "src/service/api";
import contextHolder from "src/service/contextService";
import { loginUserIsEduStaff } from "src/service/permissionService";
import toastHolder from "src/service/toastService";

const TopicCreate = ({ location }) => {
  const history = useHistory();
  const [form, setForm] = useState({
    // thesis: false,
    educationMethods: [],
    majors: [],
    minStudentTake: 1,
    maxStudentTake: 3,
  });
  const [thesis, setThesis] = useState(false);
  const [guideTeachers, setGuideTeachers] = useState([]);
  const [searchTeachers, setSearchTeachers] = useState(false);
  const [searchStudent, setSearchStudent] = useState(false);
  const [studentExecutes, setStudentExecutes] = useState([]);
  const [valid, setValid] = useState(false);
  const [waiting, setWaiting] = React.useState(false);
  const [searchStudentProps, setSearchStudentProps] = React.useState({});
  const [createOutlineTime, setCreateOutlineTime] = React.useState(true);
  const [createThesisTime, setCreateThesisTime] = React.useState(true);

  const creator = guideTeachers[0]?.id === contextHolder.user.id;
  const efuStaff = loginUserIsEduStaff();

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

  const editorProps = (path) => {
    return {
      data: _.get(form, path) ?? "",
      onChange: (event, editor) => setValueForm(path, editor.getData()),
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
      onChange: (e) => {
        if (
          path === "maxStudentTake" &&
          studentExecutes.length > e.currentTarget.value
        ) {
          setStudentExecutes([]);
        }
        setValueForm(path, e.currentTarget.value);
      },
    };
  };

  const canAssignStudent = () => {
    if (
      (!form.name?.vi && !form.name?.en) ||
      form.educationMethods?.length < 1 ||
      form.majors?.length < 1
    ) {
      toastHolder.error("????? t??i thi???u th??ng tin");
      setValid(true);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return false;
    }
    return true;
  };

  const viewSearchStudent = () => {
    if (!canAssignStudent()) return;
    setSearchStudentProps({
      thesis: thesis,
      educationMethods: form.educationMethods,
      majors: form.majors,
    });
    setSearchStudent(true);
  };

  const create = () => {
    setWaiting(true);
    if (!canAssignStudent()) {
      setWaiting(false);
      return;
    }

    form.thesis = thesis;
    form.semester = contextHolder.semester;
    form.guideTeachers = guideTeachers.map((e) => {
      return {
        guideTeacher: e,
      };
    });
    form.students = studentExecutes.map((e) => {
      return { student: e };
    });
    if (form.id) {
      api.patch("/topics", form).then((response) => {
        setWaiting(false);
        response && history.push(`/topics/${response.id}`);
        toastHolder.success("C???p nh???t th??ng tin ????? t??i th??nh c??ng");
      });
    } else {
      api
        .post("/topics", form)
        .then((response) => {
          setWaiting(false);
          response &&
            history.push(
              `/guide/${contextHolder.semester.name}/${response.id}`
            );
          toastHolder.success("T???o ????? t??i th??nh c??ng");
        })
        .catch(() => {
          setWaiting(false);
        });
    }
  };

  useEffect(() => {
    if (location?.state) {
      const exitTopic = location.state;
      exitTopic.educationMethods = exitTopic.educationMethods.map((e) => e.id);
      exitTopic.majors = exitTopic.majors.map((e) => e.id);
      setForm(exitTopic);
      setThesis(exitTopic.thesis);
      setGuideTeachers(exitTopic.guideTeachers);
      setStudentExecutes(exitTopic.students);
    } else {
      setGuideTeachers([contextHolder.user]);
      api
        .get(`/semesters/in-create-time`, { params: { thesis: false } })
        .then((res) => {
          setCreateOutlineTime(res);
          if (!res) setThesis(true);
        });
      api
        .get(`/semesters/in-create-time`, { params: { thesis: true } })
        .then(setCreateThesisTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (waiting) throw new Promise(() => {});

  return (
    <CCard>
      <TeacherSearchModal
        view={searchTeachers}
        disableView={() => setSearchTeachers(false)}
        selected={(teacher) => {
          setSearchTeachers(false);
          setGuideTeachers([...guideTeachers, teacher]);
        }}
        userNotShow={[contextHolder.user, ...guideTeachers]}
      />
      <CCardHeader>
        <h4>{form.id ? `Ch???nh s???a ????? t??i` : "T???o ????? t??i"}</h4>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CFormGroup row>
            <CCol>
              <CLabel htmlFor="name.vi">
                <strong>T??n ????? t??i ti???ng vi???t</strong>
              </CLabel>
              <CInput
                id="name.vi"
                invalid={valid && !form.name?.vi && !form.name?.en}
                {...setGetForm("name.vi")}
              />
            </CCol>
            <CCol>
              <CLabel htmlFor="name.en">
                <strong>T??n ????? t??i ti???ng anh</strong>
              </CLabel>
              <CInput
                id="name.en"
                invalid={valid && !form.name?.vi && !form.name?.en}
                {...setGetForm("name.en")}
              />
            </CCol>
          </CFormGroup>

          <CFormGroup row>
            <CCol md="6">
              <CFormGroup row>
                <CCol md="4">
                  <CLabel>
                    <strong>Lo???i ????? t??i</strong>
                  </CLabel>
                  <CFormGroup variant="custom-radio">
                    <CInputRadio
                      custom
                      id="nonThesis"
                      name="type"
                      checked={!thesis}
                      value={false}
                      onChange={() => {
                        setThesis(false);
                        setStudentExecutes([]);
                      }}
                      disabled={!createOutlineTime}
                    />
                    <CLabel variant="custom-checkbox" htmlFor="nonThesis">
                      ????? c????ng
                    </CLabel>
                  </CFormGroup>
                  <CFormGroup variant="custom-radio" inline>
                    <CInputRadio
                      custom
                      id="thesis"
                      name="type"
                      checked={thesis}
                      onChange={() => {
                        setThesis(true);
                        setStudentExecutes([]);
                      }}
                      value={true}
                      disabled={!createThesisTime}
                    />
                    <CLabel variant="custom-checkbox" htmlFor="thesis">
                      Lu???n v??n
                    </CLabel>
                  </CFormGroup>
                </CCol>
                <CCol md="5">
                  <CLabel>
                    <strong>Ph????ng th???c ????o t???o</strong>
                  </CLabel>
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
                        invalid={valid && form.educationMethods?.length < 1}
                        onChange={(event) => {
                          onChangeCheck(event, "educationMethods");
                          setStudentExecutes([]);
                        }}
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
                  <CLabel>
                    <strong>Chuy??n ng??nh</strong>
                  </CLabel>
                  {contextHolder.majors.map((major) => (
                    <CFormGroup key={major.id} variant="custom-checkbox">
                      <CInputCheckbox
                        custom
                        id={"major" + major.id}
                        name="major"
                        value={major.id}
                        invalid={valid && form.majors?.length < 1}
                        onChange={(event) => {
                          onChangeCheck(event, "majors");
                          setStudentExecutes([]);
                        }}
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
                  <CLabel htmlFor="select">
                    <strong>S??? l?????ng sinh vi??n</strong>
                  </CLabel>

                  <CFormGroup row>
                    <CCol md="6">
                      <CLabel htmlFor="selectMin">T???i thi???u</CLabel>
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
                      <CLabel htmlFor="selectMax">T???i ??a</CLabel>
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
              <CLabel>
                <strong>Gi??o vi??n h?????ng d???n</strong>
              </CLabel>
              <CFormGroup row>
                <CCol md="6">
                  <UserCard user={guideTeachers[0]} />
                </CCol>
              </CFormGroup>
              <CLabel>
                <strong>Gi??o vi??n ?????ng h?????ng d???n</strong>
              </CLabel>
              <CFormGroup row>
                {guideTeachers.slice(1, 3).map((guideTeacher, index) => (
                  <CCol key={index} md="6">
                    <UserCard
                      user={guideTeacher}
                      remove={
                        creator || efuStaff
                          ? () => (teacher) =>
                              setGuideTeachers(
                                guideTeachers.filter((e) => e !== teacher)
                              )
                          : null
                      }
                    />
                  </CCol>
                ))}
                {guideTeachers.length < 3 && (creator || efuStaff) && (
                  <CCol md="4">
                    <CButton
                      type="button"
                      color="info"
                      onClick={() => setSearchTeachers(true)}
                    >
                      Th??m gi??o vi??n
                    </CButton>
                  </CCol>
                )}
              </CFormGroup>
            </CCol>
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="description">
              <strong>M?? t???</strong>
            </CLabel>
            <CKEditor editor={ClassicEditor} {...editorProps("description")} />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="task">
              <strong>Nhi???m v???</strong>
            </CLabel>
            <CKEditor editor={ClassicEditor} {...editorProps("task")} />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="documentReference">
              <strong>T??i li???u tham kh???o</strong>
            </CLabel>
            <CKEditor
              editor={ClassicEditor}
              {...editorProps("documentReference")}
            />
          </CFormGroup>

          <CCardFooter>
            <StudentSearchModal
              view={searchStudent}
              disableView={() => setSearchStudent(false)}
              userNotShow={studentExecutes}
              selected={(student) => {
                setSearchStudent(false);
                setStudentExecutes([...studentExecutes, student]);
              }}
              {...searchStudentProps}
            />
            <CFormGroup>
              <CLabel>
                <strong>Sinh vi??n th???c hi???n</strong>
              </CLabel>
              <CFormGroup row>
                {_.range(0, studentExecutes.length).map((index) => (
                  <CCol md="4">
                    <UserCard
                      user={studentExecutes[index]}
                      remove={() =>
                        setStudentExecutes(
                          studentExecutes.filter(
                            (e) => e.id !== studentExecutes[index].id
                          )
                        )
                      }
                    />
                  </CCol>
                ))}
                {studentExecutes.length < form.maxStudentTake && (
                  <CCol md="4">
                    <CButton
                      type="button"
                      color="info"
                      onClick={viewSearchStudent}
                    >
                      Th??m sinh vi??n
                    </CButton>
                  </CCol>
                )}
              </CFormGroup>
            </CFormGroup>
          </CCardFooter>
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" color="primary" onClick={create}>
          <CIcon name="cil-save" /> {form.id ? `C???p nh???t ????? t??i` : "T???o ????? t??i"}
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default TopicCreate;
