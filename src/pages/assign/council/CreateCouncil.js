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
  CLabel,
  CRow,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import UserCard from "src/components/UserCard";
import TeacherSearchModal from "src/pages/teacher/TeacherSearchModal";
import api from "src/service/api";
import contextHolder from "src/service/contextService";
import toastHolder from "src/service/toastService";

const MainComponent = ({ location }) => {
  const subjectDepartmentId = window.location.pathname.split("/")[2];

  const history = useHistory();
  const [form, setForm] = useState({});
  const [councilRoles, setCouncilRoles] = useState([]);
  const [searchTeachers, setSearchTeachers] = useState(false);
  const [currentRole, setCurrentRole] = useState(-1);

  const remove = (roleIndex, teacherId) => {
    const nextRoles = _.cloneDeep(councilRoles);
    const nextTeachers = councilRoles[roleIndex].teachers.filter(
      (e) => e.id !== teacherId
    );
    nextRoles[roleIndex].teachers = nextTeachers;
    setCouncilRoles(nextRoles);
  };

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

  const submit = () => {
    form.semester = contextHolder.semester;
    form.subjectDepartment = contextHolder.subjectDepartments.find(
      (e) => e.id.toString() === subjectDepartmentId
    );
    form.members = councilRoles
      .map((role) =>
        role.teachers.map((user) => {
          return {
            role: role,
            member: user,
          };
        })
      )
      .flat();
    if (form.members?.length < 1) {
      toastHolder.error("Hội đồng không có thành viên");
      return;
    }
    if (form.id) {
      api.patch("/councils", form).then(() => {
        toastHolder.success("Cập nhật hội đồng thành công");
        history.push(`/councils/${subjectDepartmentId}`);
      });
    } else {
      api.post("/councils", form).then(() => {
        toastHolder.success("Tạo hội đồng thành công");
        const currentPath = window.location.pathname;
        history.push(
          `${currentPath.substring(0, currentPath.lastIndexOf("/"))}`
        );
      });
    }
  };

  const onFormSelected = (teacher) => {
    setSearchTeachers(false);
    const nextRoles = _.cloneDeep(councilRoles);
    const nextTeachers = [...councilRoles[currentRole].teachers, teacher];
    nextRoles[currentRole].teachers = nextTeachers;
    setCouncilRoles(nextRoles);
  };

  useEffect(() => {
    if (location?.state) {
      setForm(location.state);
    }
    api
      .get("/council-roles", {
        params: {
          sort: "displayOrder",
        },
      })
      .then((response) => {
        response.forEach((e) => {
          e.teachers = [];
          if (location?.state) {
            location.state.members?.forEach((councilMember) => {
              if (councilMember.role.id === e.id)
                e.teachers = [...e.teachers, councilMember.member];
            });
          }
        });
        setCouncilRoles(response);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <TeacherSearchModal
        view={searchTeachers}
        disableView={() => setSearchTeachers(false)}
        selected={onFormSelected}
        userNotShow={councilRoles.map((role) => role.teachers).flat()}
      />
      <CCardHeader>
        <h5 className="card-title mb-0">
          {form.id ? `Chỉnh sửa` : "Tạo"} {" hội đồng "} {form.id}
        </h5>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CRow style={{ width: `${form.id ? "100%" : "50%"}` }}>
            <CCol className="mb-4">
              <CRow>
                {councilRoles.map((role, index) => (
                  <CCol
                    key={role.id}
                    md={role.max > 1 ? 12 : 6}
                    className="border py-2"
                  >
                    <CFormGroup className="mb-0">
                      <CLabel>
                        <strong>{role.name}</strong>
                      </CLabel>
                      <br />
                      <CRow>
                        {role.teachers.map((e) => (
                          <CCol key={e} md={role.max > 1 ? 6 : 12}>
                            <UserCard
                              user={e}
                              remove={() => remove(index, e.id)}
                            />
                          </CCol>
                        ))}
                        {_.range(role.teachers.length, role.max).map((e) => (
                          <CCol key={e}>
                            <CButton
                              key={e}
                              size="sm"
                              type="button"
                              color="primary"
                              onClick={() => {
                                setCurrentRole(index);
                                setSearchTeachers(true);
                              }}
                            >
                              Phân công giáo viên
                            </CButton>
                          </CCol>
                        ))}
                      </CRow>
                    </CFormGroup>
                  </CCol>
                ))}
              </CRow>
            </CCol>

            {form.id && (
              <CCol>
                <CFormGroup>
                  <CLabel>
                    <strong>Địa điểm</strong>
                  </CLabel>
                  <CInput
                    placeholder="Cơ sở, tòa nhà, phòng hoặc link meet..."
                    {...setGetForm("location")}
                  />
                </CFormGroup>

                <CFormGroup row>
                  <CCol>
                    <CLabel>
                      <strong>Ngày</strong>
                    </CLabel>
                    <CInput type="date" {...setGetForm("reserveDate")} />
                  </CCol>
                  <CCol>
                    <CLabel>
                      <strong>Thời gian bắt đầu</strong>
                    </CLabel>
                    <CInput type="time" {...setGetForm("startTime")} />
                  </CCol>
                  {/* <CCol>
                  <CLabel>Thời gian kết thúc</CLabel>
                  <CInput type="time" {...setGetForm("endTime")} />
                </CCol> */}
                </CFormGroup>

                <CFormGroup>
                  <CLabel>
                    <strong>Ghi chú</strong>
                  </CLabel>
                  <CKEditor
                    editor={ClassicEditor}
                    data={_.get(form, "note") ?? ""}
                    onChange={(event, editor) =>
                      setValueForm("note", editor.getData())
                    }
                  />
                  {/* <CTextarea
                  rows="7"
                  placeholder="Ghi chú..."
                  {...setGetForm("note")}
                /> */}
                </CFormGroup>
              </CCol>
            )}
          </CRow>
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" color="primary" onClick={submit}>
          <CIcon name="cil-save" /> Lưu
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default MainComponent;
