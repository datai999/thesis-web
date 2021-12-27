import { CCard, CCardHeader } from "@coreui/react";
import React, { useEffect, useState } from "react";
import FinalMark from "src/components/topic/FinalMark";
import { TopicDetailBody } from "src/pages/topic/TopicDetail";
import api from "src/service/api";
import context from "src/service/contextService";

const MainComponent = () => {
  const topicId = window.location.pathname.split("/")[3];
  const [topic, setTopic] = useState({ guideTeachers: [] });
  const [afterMidMarkEndTime, setAfterMidMarkEndTime] = useState(false);

  useEffect(() => {
    api.get(`/topics/detail/${topicId}`).then((res) => {
      setTopic(res);
      api
        .get(`/semesters/compare-mid-mark-end-time`, {
          params: { thesis: res.thesis, before: false },
        })
        .then(setAfterMidMarkEndTime);
    });
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
      </CCardHeader>

      {topic.students?.length > 0 &&
        (topic.semester?.id !== context.semester.id || afterMidMarkEndTime) && (
          <FinalMark guide={false} topic={topic} />
        )}
    </CCard>
  );
};

export default MainComponent;
