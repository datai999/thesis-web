import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import api from "src/service/api";
import AssignCouncilTable from "./AssignCouncilTable";
import Council from "./Council";

const MainComponent = ({ location }) => {
  const paths = location.pathname.match(
    /(?:\/councils\/)(\d)(?:\/edit\/)(\d)/,
    ""
  );
  const subjectDepartmentId = paths[1];
  const councilId = paths[2];

  const [assignedTopics, setAssignedTopics] = useState(location.state.topics);
  const [unassignTopics, setUnassignTopics] = useState([]);

  const submit = () => {
    // TODO
    alert("submit");
  };

  const assign = (topic) => {
    setUnassignTopics(unassignTopics.filter((e) => e.id !== topic.id));
    setAssignedTopics([...assignedTopics, topic]);
  };

  const unassign = (topic) => {
    setAssignedTopics(assignedTopics.filter((e) => e.id !== topic.id));
    setUnassignTopics([...unassignTopics, topic]);
  };

  const getUnassignTopics = () => {
    api
      .get(`/topics/need-council`, {
        params: { subjectDepartmentId },
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
    getUnassignTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Council location={location} />
      <CCard>
        <CCardBody>
          <CRow>
            <CCol>
              <h5 className="card-title mb-0">Đề tài thuộc hội đồng</h5>
              <AssignCouncilTable
                onRowClick={unassign}
                topics={assignedTopics}
              />
            </CCol>
            <CCol>
              <h5 className="card-title mb-0">Đề tài cần gán hội đồng</h5>
              <AssignCouncilTable onRowClick={assign} topics={unassignTopics} />
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton color="primary" onClick={submit}>
            <CIcon name="cil-save" /> Lưu
          </CButton>
        </CCardFooter>
      </CCard>
    </>
  );
};

export default MainComponent;
