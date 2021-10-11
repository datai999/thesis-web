import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CTabs
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import UserCard from "src/components/UserCard";
import TopicCard from "src/pages/topic/TopicCard";
import api from "src/service/api";
import MarkTab from "./MarkTab";

const MainComponent = () => {
  const searchParams = new URL(window.location.href).searchParams;
  const topicId = window.location.pathname.match(
    /my\/topics\/([0-9]+)\/mark/,
    ""
  )[1];

  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState([]);
  const [topic, setTopic] = useState({});
  const [student, setStudent] = useState({});

  useEffect(() => {
    api
      .get(`/setting-templates/topic`, {
        params: {
          topicId,
          role: searchParams.get("role"),
        },
      })
      .then((res) => {
        setData(res);
      });
    api.get(`/topics/detail/${topicId}`).then((response) => {
      setTopic(response);
      const targetStudent = response.students.find(
        (e) => e.code == searchParams.get("student")
      );
      setStudent(targetStudent);
    });
  }, []);

  return (
    <CCard>
      <CCardHeader className="pb-2">
        <CRow class="d-flex justify-content-center">
          <CCol md="4">
            <TopicCard topic={topic} />
          </CCol>
          <CCol md="4">
            <UserCard user={student} />
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CTabs activeTab={tabIndex} onActiveTabChange={setTabIndex}>
          <CNav variant="tabs">
            {data.map((e) => (
              <CNavItem key={e.id}>
                <CNavLink>{e.template?.name}</CNavLink>
              </CNavItem>
            ))}
          </CNav>
          <CTabContent>
            {data.map((tabData, index) => (
              <CTabPane>
                {index === tabIndex && (
                  <MarkTab
                    settingTemplate={tabData}
                    topicId={topicId}
                    studentId={student.id}
                  />
                )}
              </CTabPane>
            ))}
          </CTabContent>
        </CTabs>
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
