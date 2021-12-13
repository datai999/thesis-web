import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInputRadio,
  CLabel,
  CRow,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "src/service/api";
import contextHolder from "src/service/contextService";
import { PERMISSIONS } from "src/service/permissionService";
import toastHolder from "src/service/toastService";

const renderPermission = (permission) => {
  switch (permission) {
    case "STUDENT":
      return "Sinh viên";
    case "TEACHER":
      return "Giáo viên";
    case "HEAD_SUBJECT_DEPARTMENT":
      return "Trưởng bộ môn";
    case "EDUCATION_STAFF":
      return "Giáo vụ";
    case "ADMIN":
      return "Quản trị hệ thống";
    default:
      return "Khách";
  }
};

const getPermission = (userType) => {
  switch (userType) {
    case "head":
      return PERMISSIONS.HEAD_SUBJECT_DEPARTMENT;
    case "edu-staff":
      return PERMISSIONS.EDUCATION_STAFF;
    case "users":
      return PERMISSIONS.STUDENT;
    default:
      return userType.toUpperCase();
  }
};

const MainComponent = () => {
  const path = window.location.pathname.match(/(?:\/users\/)(\d+)/, "");
  const userId = path && path[1];
  const createType = !userId && window.location.pathname.split("/")[2];

  const history = useHistory();

  const [user, setUser] = useState({
    male: true,
    permission: getPermission(createType),
  });
  const [permissions, setPermissions] = useState([]);

  const setValueForm = (path, value) => {
    let nextForm = _.cloneDeep(user);
    _.set(nextForm, path, value);
    setUser(nextForm);
  };

  const setGetForm = (getPath, setPath) => {
    return {
      value: _.get(user, getPath),
      onChange: (e) => setValueForm(getPath ?? setPath, e.target.value),
    };
  };

  const onChangeCheck = (event, path) => {
    const value = event.currentTarget.value;
    let current = _.get(user, path) ?? [];
    if (current.includes(value)) {
      current = current.filter((element) => element !== value);
    } else {
      current.push(value);
    }
    setValueForm(path, current);
  };

  const renderRadioCheck = (name) =>
    contextHolder[name + "s"].map((e) => (
      <CFormGroup key={e.id} variant="custom-radio">
        <CInputRadio
          custom
          id={name + e.id}
          value={e.id}
          onChange={() => setValueForm(name, e)}
          checked={user[name]?.id === e.id}
        />
        <CLabel variant="custom-checkbox" htmlFor={name + e.id}>
          {e.name}
        </CLabel>
      </CFormGroup>
    ));

  const save = () => {
    if (userId)
      api.patch(`/users`, user).then(() => {
        toastHolder.success("Cập nhật thông tin người dùng thành công");
        history.push(`/users/${userId}`);
      });
    else
      api.post(`/users`, user).then((res) => {
        toastHolder.success("Tạo người dùng thành công");
        history.push(`/users/${res.id}`);
      });
  };

  useEffect(() => {
    userId && api.get(`/users/detail/${userId}`).then(setUser);
    api.get(`/users/permissions`).then(setPermissions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard style={{ minWidth: "50%", maxWidth: 600, margin: "auto" }}>
      <CCardBody>
        <CForm>
          <CRow>
            <CCol md="3">
              <CIcon
                width={64}
                name="cil-user"
                style={{ position: "absolute", right: 24, top: 24 }}
              />
            </CCol>
            <CCol>
              <CFormGroup row className="mb-1">
                <CCol md="3" className="pl-3">
                  Mã số:
                </CCol>
                <CCol>
                  <CInput {...setGetForm("code")} />
                </CCol>
              </CFormGroup>
              <CFormGroup row className="mb-1">
                <CCol md="3" className="pl-3">
                  Họ và tên:
                </CCol>
                <CCol>
                  <CRow>
                    <CCol md="8">
                      <CInput {...setGetForm("firstName")} />
                    </CCol>
                    <CCol>
                      <CInput {...setGetForm("lastName")} />
                    </CCol>
                  </CRow>
                </CCol>
              </CFormGroup>
              <CFormGroup row className="mb-1">
                <CCol md="3" className="pl-3">
                  Email:
                </CCol>
                <CCol>
                  <CInput {...setGetForm("email")} />
                </CCol>
              </CFormGroup>
              <CFormGroup row className="mb-1">
                <CCol md="3" className="pl-3">
                  Giới tính:
                </CCol>
                <CCol>
                  <CFormGroup variant="custom-radio" inline>
                    <CInputRadio
                      custom
                      id="male"
                      name="gender"
                      checked={user.male}
                      value={true}
                      onChange={() => setValueForm("male", true)}
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
                      checked={!user.male}
                      onChange={() => setValueForm("male", false)}
                      value={false}
                    />
                    <CLabel variant="custom-checkbox" htmlFor="female">
                      Nữ
                    </CLabel>
                  </CFormGroup>
                </CCol>
              </CFormGroup>
            </CCol>
          </CRow>

          <div className="ml-5 mt-3">
            {userId && (
              <CFormGroup row>
                <CCol md="4">Quyền hạn</CCol>
                <CCol>
                  {permissions.map((e) => (
                    <CFormGroup key={e.id} variant="custom-radio">
                      <CInputRadio
                        custom
                        id={e}
                        value={e}
                        checked={user.permission === e}
                        onChange={() => setValueForm("permission", e)}
                      />
                      <CLabel variant="custom-checkbox" htmlFor={e}>
                        {renderPermission(e)}
                      </CLabel>
                    </CFormGroup>
                  ))}
                </CCol>
              </CFormGroup>
            )}

            {user.permission === PERMISSIONS.STUDENT && (
              <>
                <CFormGroup row>
                  <CCol md="4">Chuyên ngành:</CCol>
                  <CCol>{renderRadioCheck("major")}</CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="4">Phương thức đào tạo:</CCol>
                  <CCol>{renderRadioCheck("educationMethod")}</CCol>
                </CFormGroup>
              </>
            )}

            {["TEACHER", "HEAD_SUBJECT_DEPARTMENT"].includes(
              user.permission
            ) && (
              <>
                <CFormGroup row>
                  <CCol md="4">Bộ môn:</CCol>
                  <CCol>{renderRadioCheck("subjectDepartment")}</CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="4">Học vị:</CCol>
                  <CCol>{renderRadioCheck("degree")}</CCol>
                </CFormGroup>
              </>
            )}
          </div>
        </CForm>
      </CCardBody>

      <CCardFooter>
        <CButton type="submit" color="primary" size="sm" onClick={save}>
          <CIcon name="cil-save" /> Lưu
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default MainComponent;
