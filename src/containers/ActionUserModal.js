import {
  CButton,
  CCol,
  CForm,
  CInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import api from "src/service/api";

const MainComponent = ({ view, disableView }) => {
  const history = useHistory();

  const [userId, setUserId] = React.useState();
  const [user, setUser] = React.useState({});

  const confirm = async () => {
    // await setLocalUser(user);
    history.go(0);
  };

  React.useEffect(() => {
    if (userId)
      api
        .get(`/users/detail/${userId}`)
        .then(setUser)
        .catch(() => setUser({}));
  }, [userId]);

  return (
    <CModal color="info" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Người thực hiện hành động</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol md="3">UserId</CCol>
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
          <CCol md="3">Email</CCol>
          <CCol>{user.email}</CCol>
        </CRow>
        <CRow>
          <CCol md="3">Tên</CCol>
          <CCol>{user.fullName}</CCol>
        </CRow>
        <CRow>
          <CCol md="3">Quyền hạn</CCol>
          <CCol>{user.permission}</CCol>
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
