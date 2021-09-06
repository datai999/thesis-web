import CIcon from "@coreui/icons-react";
import { CButton, CCard, CCol, CContainer, CForm, CRow } from "@coreui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import { getIdToken, signInWithGoogle } from "../../../service/firebase";

const Login = () => {
  const history = useHistory();

  const login = async () => {
    await signInWithGoogle();
    console.log(await getIdToken());
    // history.push(`/`);
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCard className="p-4">
              <CForm>
                <h2>Hệ thống đánh giá luận văn</h2>
                <CRow className="pt-4">
                  <CCol md="8">
                    <CIcon name="cib-google" />
                    <CButton color="primary" className="px-4" onClick={login}>
                      Đăng nhập
                    </CButton>
                  </CCol>
                  <CCol>
                    <CButton color="link" className="px-0">
                      Đăng ký
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
