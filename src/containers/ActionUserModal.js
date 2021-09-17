import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CInput,
  CForm,
} from "@coreui/react";
import React from "react";
import api, { setLocalUser } from "../service/api";

const MainComponent = ({ view, disableView }) => {
  const [userId, setUserId] = React.useState();
  const [user, setUser] = React.useState({});

  const search = () => {
    api
      .get(`/users/detail/${userId}`)
      .then(setUser)
      .catch((error) => setUser({}));
  };

  const confirm = () => {
    setLocalUser(user);
    disableView();
  };

  React.useEffect(() => {
    search();
  }, [userId]);

  return (
    <CModal color="info" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Người thực hiện hành động</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol md="2">UserId</CCol>
          <CCol>
            <CForm>
              <CInput
                id="name.vi"
                placeholder="Text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </CForm>
          </CCol>
        </CRow>
        <CRow>
          <CCol md="2">Email</CCol>
          <CCol>{user.email}</CCol>
        </CRow>
        <CRow>
          <CCol md="2">Type</CCol>
          <CCol>{user.type}</CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="info" onClick={confirm}>
          Xác nhận
        </CButton>
        <CButton color="secondary" onClick={disableView}>
          Quay về
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MainComponent;
