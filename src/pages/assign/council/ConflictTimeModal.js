import {
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React from "react";
import UserCard from "src/components/UserCard";

const MainComponent = ({
  view,
  disableView,
  reserveDate,
  councilMember = [],
}) => {
  return (
    <CModal color="warning" size="md" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>
          Các giáo viên đã có lịch hội đồng ngày {reserveDate}
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CRow>
          {councilMember?.map((e) => (
            <CCol md="6">
              <UserCard user={e.member} />
            </CCol>
          ))}
        </CRow>
      </CModalBody>
    </CModal>
  );
};

export default MainComponent;
