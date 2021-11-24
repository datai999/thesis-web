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
import CreateCouncil from "../assign/council/CreateCouncil";
import AssignCouncilTable from "./AssignCouncilTable";

const MainComponent = ({ location }) => {
  const paths = location.pathname.match(
    /(?:\/councils\/)(\d+)(?:\/edit\/)(\d+)/,
    ""
  );
  const subjectDepartmentId = paths[1];
  const councilId = paths[2];

  const [assignedTopics, setAssignedTopics] = useState([]);
  const [unassignTopics, setUnassignTopics] = useState([]);
  const [toggle, setToggle] = useState(false);

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

  const getAssignedTopics = () => {
    api
      .get(`/councils/detail/${councilId}`)
      .then((response) => setAssignedTopics(response.topics));
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
    getAssignedTopics();
    getUnassignTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CreateCouncil location={location} />
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
