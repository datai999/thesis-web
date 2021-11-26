import {
  CCardFooter,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React from "react";
import UserCard from "src/components/UserCard";
import { TopicDetailBody } from "src/pages/topic/TopicDetail";

const MainComponent = ({ view, disableView, topic = {} }) => {
  return !topic ? null : (
    <CModal color="info" size="lg" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Thông tin đề tài</CModalTitle>
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
    </CModal>
  );
};

export default MainComponent;
