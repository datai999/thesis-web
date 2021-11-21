import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardHeader,
  CTooltip,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { TopicDetailBody } from "src/pages/topic/TopicDetail";
import api from "src/service/api";
import context from "src/service/contextService";
import MidMark from "./MidMark";

const MainComponent = () => {
  const history = useHistory();
  const topicId = window.location.pathname.split("/")[3];
  const [topic, setTopic] = useState({ guideTeachers: [] });
  const [endRegisterTopic, setEndRegisterTopic] = useState(false);

  useEffect(() => {
    api.get(`/topics/detail/${topicId}`).then((res) => {
      setTopic(res);
    });
    api
      .get(`/semesters/allow-student-register-cancel`)
      .then((res) => setEndRegisterTopic(!res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardHeader>
        <h5>{topic.name?.vi}</h5>
        <h5>{topic.name?.en}</h5>
      </CCardHeader>

      <CCardHeader>
        <TopicDetailBody topic={topic} />
        <CButtonGroup
          vertical
          size="sm"
          style={{ position: "absolute", top: 5, right: 5 }}
        >
          <CTooltip content={"Chỉnh sửa"}>
            <CButton
              color="primary"
              variant="outline"
              onClick={() => {
                history.push(`${window.location.pathname}/edit`, topic);
              }}
            >
              <CIcon name="cil-pencil" />
            </CButton>
          </CTooltip>
        </CButtonGroup>
      </CCardHeader>

      {topic.students?.length > 0 &&
        (topic.semester?.id !== context.semester.id || endRegisterTopic) && (
          <MidMark topic={topic} />
        )}
    </CCard>
  );
};

export default MainComponent;
