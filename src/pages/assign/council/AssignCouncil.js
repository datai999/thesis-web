import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import api from "src/service/api";
import toastHolder from "src/service/toastService";
import AssignCouncilModal from "./AssignCouncilModal";
import CreateCouncil from "./CreateCouncil";
import TopicAssignList from "./TopicAssignList";

const MainComponent = ({ location }) => {
  const paths = location.pathname.split("/");
  const councilId = paths[5];

  const [assignedTopics, setAssignedTopics] = useState([]);
  const [unassignTopics, setUnassignTopics] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [assignTopicModal, setAssignTopicModal] = useState(false);
  const [modalProps, setModalProps] = useState({ topic: {} });

  const submit = () => {
    api
      .patch(
        `/councils/${councilId}/assign-topics?topicIds=${assignedTopics.map(
          (e) => e.id
        )}`
      )
      .then(() => {
        toastHolder.success("Phân công hội đồng thành công");
        setToggle(!toggle);
      });
  };

  const assign = (topic) => {
    setUnassignTopics(unassignTopics.filter((e) => e.id !== topic.id));
    setAssignedTopics([...assignedTopics, topic]);
  };

  const unassign = (topic) => {
    setAssignedTopics(assignedTopics.filter((e) => e.id !== topic.id));
    setUnassignTopics([...unassignTopics, topic]);
  };

  const confirmAssign = (topic, isAssign) => {
    setModalProps({
      topic,
      assign: isAssign,
      confirm: isAssign ? assign : unassign,
    });
    setAssignTopicModal(true);
  };

  const getAssignedTopics = () => {
    api
      .post(`/topics/example`, {
        // thesis: true,
        council: { id: councilId },
      })
      .then(setAssignedTopics);
  };

  const getUnassignTopics = () => {
    api
      .get(`/topics/need-council`, {
        params: { subjectDepartmentId: location.state?.subjectDepartment?.id },
      })
      .then((response) => {
        response.forEach((e) => {
          e.guideTeacherRenders = e.guideTeachers.map((user) =>
            `${user.code} ${user.firstName} ${user.lastName} ${user.email}`.toString()
          );
        });
        setUnassignTopics(response);
      });
  };

  useEffect(() => {
    getAssignedTopics();
    getUnassignTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);

  return (
    <>
      <AssignCouncilModal
        view={assignTopicModal}
        disableView={() => setAssignTopicModal(false)}
        {...modalProps}
      />

      <CreateCouncil location={location} />

      <CCard>
        <CCardBody>
          <CRow>
            <CCol>
              <h5 className="card-title mb-0">Đề tài thuộc hội đồng</h5>
              <TopicAssignList
                onRowClick={(topic) => confirmAssign(topic, false)}
                topics={assignedTopics}
              />
            </CCol>
            <CCol>
              <h5 className="card-title mb-0">Đề tài cần gán hội đồng</h5>
              <TopicAssignList
                onRowClick={(topic) => confirmAssign(topic, true)}
                topics={unassignTopics}
              />
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton color="primary" onClick={submit}>
            <CIcon name="cil-save" /> Lưu kết quả phân công
          </CButton>
        </CCardFooter>
      </CCard>
    </>
  );
};

export default MainComponent;
