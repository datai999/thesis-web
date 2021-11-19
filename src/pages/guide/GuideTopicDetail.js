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

const MainComponent = () => {
  const history = useHistory();
  const topicId = window.location.pathname.split("/")[3];
  const [topic, setTopic] = useState({ guideTeachers: [] });

  useEffect(() => {
    api.get(`/topics/detail/${topicId}`).then((res) => {
      setTopic(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard className="mx-5">
      <CCardHeader className="mx-3">
        <h5>{topic.name?.vi}</h5>
        <h5>{topic.name?.en}</h5>
      </CCardHeader>

      <div className="mx-2">
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
      </div>
    </CCard>
  );
};

export default MainComponent;
