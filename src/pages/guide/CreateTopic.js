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

  const creator = guideTeachers[0]?.id === contextHolder.user.id;

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
      toastHolder.error("Đề tài thiếu thông tin");
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
        toastHolder.success("Cập nhật thông tin đề tài thành công");
      });
    } else {
      api.post("/topics", form).then((response) => {
        setWaiting(false);
        response &&
          history.push(`/guide/${contextHolder.semester.name}/${response.id}`);
        toastHolder.success("Tạo đề tài thành công");
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
      setGuideTeachers(location.state.guideTeachers);
    } else {
      setGuideTeachers([contextHolder.user]);
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
        <h4>{form.id ? `Chỉnh sửa đề tài` : "Tạo đề tài"}</h4>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CFormGroup row>
            <CCol>
              <CLabel htmlFor="name.vi">
                <strong>Tên đề tài tiếng việt</strong>
              </CLabel>
              <CInput
                id="name.vi"
                invalid={valid && !form.name?.vi && !form.name?.en}
                {...setGetForm("name.vi")}
              />
            </CCol>
            <CCol>
              <CLabel htmlFor="name.en">
                <strong>Tên đề tài tiếng anh</strong>
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
                    <strong>Loại đề tài</strong>
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
                      onChange={() => {
                        setThesis(true);
                        setStudentExecutes([]);
                      }}
                      value={true}
                    />
                    <CLabel variant="custom-checkbox" htmlFor="thesis">
                      Luận văn
                    </CLabel>
                  </CFormGroup>
                </CCol>
                <CCol md="5">
                  <CLabel>
                    <strong>Phương thức đào tạo</strong>
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
                    <strong>Chuyên ngành</strong>
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
                    <strong>Số lượng sinh viên</strong>
                  </CLabel>

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
              <CLabel>
                <strong>Giáo viên hướng dẫn</strong>
              </CLabel>
              <CFormGroup row>
                <CCol md="6">
                  <UserCard user={guideTeachers[0]} />
                </CCol>
              </CFormGroup>
              <CLabel>
                <strong>Giáo viên đồng hướng dẫn</strong>
              </CLabel>
              <CFormGroup row>
                {guideTeachers.slice(1, 3).map((guideTeacher, index) => (
                  <CCol key={index} md="6">
                    <UserCard
                      user={guideTeacher}
                      remove={
                        creator
                          ? () => (teacher) =>
                              setGuideTeachers(
                                guideTeachers.filter((e) => e !== teacher)
                              )
                          : null
                      }
                    />
                  </CCol>
                ))}
                {guideTeachers.length < 3 && creator && (
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
            <CLabel htmlFor="description">
              <strong>Mô tả</strong>
            </CLabel>
            <CKEditor editor={ClassicEditor} {...editorProps("description")} />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="task">
              <strong>Nhiệm vụ</strong>
            </CLabel>
            <CKEditor editor={ClassicEditor} {...editorProps("task")} />
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="documentReference">
              <strong>Tài liệu tham khảo</strong>
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
                <strong>Sinh viên thực hiện</strong>
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
                      Thêm sinh viên
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
          <CIcon name="cil-save" /> {form.id ? `Cập nhật đề tài` : "Tạo đề tài"}
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default TopicCreate;
