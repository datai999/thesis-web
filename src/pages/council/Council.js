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
  CLink,
  CRow,
  CTextarea,
  CTooltip,
  CWidgetIcon
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import TeacherSearchModal from "src/pages/teacher/TeacherSearchModal";
import api from "src/service/api";
import contextHolder from "src/service/contextService";
import toastHolder from "src/service/toastService";

const MainComponent = ({ location }) => {
  const subjectDepartmentId = useLocation().pathname.match(
    /(?:\/councils\/)(\d)/,
    ""
  )[1];

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
    if (form.id) {
      api.patch("/councils", form).then(() => {
        toastHolder.success("Cập nhật hội đồng thành công");
        history.push(`/councils/${subjectDepartmentId}`);
      });
    } else {
      api.post("/councils", form).then(() => {
        toastHolder.success("Tạo hội đồng thành công");
        history.push(`/councils/${subjectDepartmentId}`);
      });
    }
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
        setView={() => setSearchTeachers(false)}
        selected={(teacher) => {
          setSearchTeachers(false);
          const nextRoles = _.cloneDeep(councilRoles);
          const nextTeachers = [...councilRoles[currentRole].teachers, teacher];
          nextRoles[currentRole].teachers = nextTeachers;
          setCouncilRoles(nextRoles);
        }}
      />
      <CCardHeader>
        <h5 className="card-title mb-0">
          {form.id ? `Chỉnh sửa` : "Tạo"} {" hội đồng "} {form.id}
        </h5>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CRow>
            <CCol className="mb-4">
              <CRow>
                {councilRoles.map((role, index) => (
                  <CCol
                    key={role.id}
                    md={role.max > 1 ? 12 : 6}
                    className="border py-2"
                  >
                    <CFormGroup className="mb-0">
                      <CLabel>{role.name}</CLabel>
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
                              Thêm giáo viên
                            </CButton>
                          </CCol>
                        ))}
                      </CRow>
                    </CFormGroup>
                  </CCol>
                ))}
              </CRow>
            </CCol>
            <CCol>
              <CFormGroup>
                <CLabel>Địa điểm</CLabel>
                <CInput
                  placeholder="Cơ sở, tòa nhà, phòng hoặc link meet..."
                  {...setGetForm("location")}
                />
              </CFormGroup>

              <CFormGroup row>
                <CCol>
                  <CLabel>Ngày</CLabel>
                  <CInput type="date" {...setGetForm("reserveDate")} />
                </CCol>
                <CCol>
                  <CLabel>Thời gian bắt đầu</CLabel>
                  <CInput type="time" {...setGetForm("startTime")} />
                </CCol>
                <CCol>
                  <CLabel>Thời gian kết thúc</CLabel>
                  <CInput type="time" {...setGetForm("endTime")} />
                </CCol>
              </CFormGroup>

              <CFormGroup>
                <CLabel>Ghi chú</CLabel>
                <CTextarea
                  rows="7"
                  placeholder="Ghi chú..."
                  {...setGetForm("note")}
                />
              </CFormGroup>
            </CCol>
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

const UserCard = ({ user, remove }) => (
  <CWidgetIcon
    color="info"
    iconPadding={false}
    className="mb-2 mx-0 px-0"
    header={
      <>
        <tr class="d-flex justify-content-between">
          <td>{`${user.degreeName} mã số ${user.code}`}</td>
          <td>
            <CTooltip content={"Xóa giáo viên"}>
              <CLink
                className="card-header-action"
                style={{ right: 5, position: "absolute" }}
                onClick={remove}
              >
                <CIcon name="cil-x-circle" />
              </CLink>
            </CTooltip>
          </td>
        </tr>
        {`${user.firstName} ${user.lastName}`}
      </>
    }
    text={<small>{`${user.email}`}</small>}
  >
    <CIcon width={24} name="cil-user" />
  </CWidgetIcon>
);

export default MainComponent;
