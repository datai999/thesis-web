import { CButton, CCard, CCol, CContainer, CForm, CRow } from "@coreui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import api from "../../../service/api";
import { getIdToken, signInWithGoogle } from "../../../service/firebase";

const Login = () => {
  const history = useHistory();

  const login = async () => {
    const result = await signInWithGoogle();
    // TODO check extend email domain
    console.log(result.user.email);
    const token = await getIdToken();
    console.log(token);
    window.localStorage.setItem("token", token);
    const loginResponse = await api.post("/users/login");
    console.log(loginResponse);
    window.localStorage.setItem("userId", loginResponse.id);
    history.push(`/dashboard`);
  };

  const tryAsAdmin = async () => {
    window.localStorage.setItem("token", "admin@hcmut.edu.vn");
    window.localStorage.setItem("userId", 1);
    history.push(`/dashboard`);
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCard className="p-4">
              <CForm>
                <h2>Hệ thống đánh giá luận văn</h2>
                {/* <CRow className="pt-4">
                  <CCol md="7">Sử dụng mail@hcmut.edu.vn</CCol>
                  <CCol>
                    <CButton color="primary" className="px-4" onClick={login}>
                      Đăng nhập
                    </CButton>
                  </CCol>
                </CRow> */}
                <CRow className="pt-4">
                  <CCol md="7">Thử nghiệm hệ thống với vai trò admin</CCol>
                  <CCol>
                    <CButton
                      color="primary"
                      className="px-4"
                      onClick={tryAsAdmin}
                    >
                      Đăng nhập
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
