import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CRow,
  CSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import CouncilCard from "src/pages/council/CouncilCard";
import MarkTab from "src/pages/my/mark/MarkTab";
import TopicCard from "src/pages/my/topic/TopicCard";
import api from "src/service/api";

const MainComponent = () => {
  const topicId = window.location.pathname.match(/score\/topic\/(\d+)/, "")[1];

  const [topic, setTopic] = useState({});
  const [topicRole, setTopicRole] = useState(-1);
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("---");
  const [settingTemplates, setSettingTemplates] = useState([]);
  const [settingTemplateIndex, setSettingTemplateIndex] = useState("---");
  const [studentId, setStudentId] = useState("---");

  useEffect(() => {
    api.get(`/topics/detail/${topicId}`).then((response) => {
      setTopic(response);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTeacherId("---");
    setSettingTemplateIndex("---");

    let role;
    let memberId = -1;

    if (topicRole === "-1") {
      role = "guide";
      setTeachers(topic.guideTeachers);
    } else if (topicRole === "-2") {
      role = "review";
      setTeachers(topic.reviewTeachers);
    } else if (topicRole > 0) {
      role = "council";
      memberId = topicRole;
      let councilTeachers = topic?.council?.members
        ?.filter((e) => e.member.id.toString() === topicRole)
        .map((e) => e.member);
      setTeachers(councilTeachers);
    }

    if (!role) return;
    api
      .get(`/setting-templates/topic`, {
        params: { topicId, role, memberId },
      })
      .then(setSettingTemplates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicRole]);

  return (
    <CCard>
      <CCardHeader>
        <CRow class="d-flex justify-content-center">
          <CCol md="4">
            <TopicCard topic={topic} />
          </CCol>
          <CCol md="4">
            <CouncilCard council={topic.council} />
          </CCol>
        </CRow>

        <br />

        <CForm>
          <CFormGroup row>
            <CCol md="2">
              Vai trò
              <CSelect size="sm" onChange={(e) => setTopicRole(e.target.value)}>
                <option>---</option>
                <option value="-1">Giáo viên hướng dẫn</option>
                <option value="-2">Giáo viên phản biện</option>
                {topic.council?.members
                  .map((member) => member.role)
                  .filter((x, i, a) => a.findIndex((e) => e.id === x.id) === i)
                  .map((e) => (
                    <option id={e.id} value={e.id}>
                      {e.name} hội đồng
                    </option>
                  ))}
              </CSelect>
            </CCol>
            <CCol md="3">
              Giáo viên
              <CSelect
                size="sm"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                <option>---</option>
                {teachers.map((e) => (
                  <option id={e.id} value={e.id}>
                    {e.code} {e.firstName} {e.lastName}
                  </option>
                ))}
              </CSelect>
            </CCol>
            <CCol>
              Mẫu tiêu chí
              <CSelect
                size="sm"
                onChange={(e) => setSettingTemplateIndex(e.target.value)}
              >
                <option>---</option>
                {settingTemplates.map((e, index) => (
                  <option id={e.id} value={index}>
                    {e.template.name}
                  </option>
                ))}
              </CSelect>
            </CCol>
            <CCol md="3">
              Sinh viên
              <CSelect size="sm" onChange={(e) => setStudentId(e.target.value)}>
                <option>---</option>
                {topic?.students?.map((e) => (
                  <option id={e.id} value={e.id}>
                    {e.code} {e.firstName} {e.lastName}
                  </option>
                ))}
              </CSelect>
            </CCol>
          </CFormGroup>
        </CForm>
      </CCardHeader>
      <CCardBody>
        {settingTemplateIndex !== "---" &&
          teacherId !== "---" &&
          studentId !== "---" && (
            <MarkTab
              settingTemplate={settingTemplates[settingTemplateIndex]}
              topicId={topicId}
              teacherId={teacherId}
              studentId={studentId}
              disableMark={true}
            />
          )}
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
