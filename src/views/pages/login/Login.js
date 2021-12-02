import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import api from "src/service/api";
import { context } from "src/service/contextService";
import toastService from "src/service/toastService";

const Login = () => {
  const history = useHistory();

  const [loading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();

  const login = () => {
    setLoading(true);
    return api
      .post(`/users/login`, { username, password })
      .then(async (token) => {
        console.log(token);
        await window.localStorage.setItem("token", token);
        await context.saveCurrentUser();
        setLoading(false);
        history.push(`/dashboard`);
      })
      .catch(() => {
        setLoading(false);
        toastService.error("Đăng nhập thất bại");
      });
  };

  if (loading) throw new Promise(() => {});
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCard className="p-1">
              <CCardBody>
                <CForm>
                  <h2>Hệ thống đánh giá luận văn</h2>
                  <br />
                  <div className="py-2 px-3">
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>@</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="Email"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                  </div>
                  <CRow>
                    <CCol>
                      <CButton color="primary" className="px-4" onClick={login}>
                        Đăng nhập
                      </CButton>
                    </CCol>
                    <CCol xs="6" className="text-right">
                      <CButton color="link" className="px-0">
                        Quên mật khẩu
                      </CButton>
                      {" | "}
                      <Link to="/register">
                        <CButton
                          color="link"
                          className="px-0"
                          active
                          tabIndex={-1}
                        >
                          Đăng ký
                        </CButton>
                      </Link>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
