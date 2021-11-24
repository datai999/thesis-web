import {
  CButton,
  CCardFooter,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React from "react";
import UserCard from "src/components/UserCard";
import { TopicDetailBody } from "src/pages/topic/TopicDetail";

const MainComponent = ({ view, disableView, confirm, assign, topic = {} }) => {
  const submit = () => {
    confirm(topic);
    disableView();
  };

  if (!topic) return null;
  return (
    <CModal color="info" size="lg" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>
          {`${assign ? "Phân" : "Huỷ phân"}`} công hội đồng
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CCardHeader>
          <center>
            <h5>{topic.names && topic.names[0]}</h5>
            <h5>{topic.names && topic.names[1]}</h5>
          </center>
        </CCardHeader>

        <TopicDetailBody topic={topic} />

        <CCardFooter>
          <div>
            <strong>Giáo viên phản biện</strong>
          </div>

          <CRow>
            {topic.reviewTeachers?.map((e) => (
              <CCol md="4">
                <UserCard user={e} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CModalBody>

      <CModalFooter>
        <CButton color="primary" onClick={submit}>
          Xác nhận{`${assign ? "" : " huỷ"}`} gán đề tài
        </CButton>
        <CButton color="secondary" onClick={disableView}>
          Quay về
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MainComponent;
