import { CCard, CCardHeader } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import FinalMark from "src/components/topic/FinalMark";
import { TopicDetailBody } from "src/pages/topic/TopicDetail";
import api from "src/service/api";
import context from "src/service/contextService";
import toastHolder from "src/service/toastService";
import MidMark from "./MidMark";

const MainComponent = () => {
  const history = useHistory();
  const topicId = window.location.pathname.split("/")[3];
  const [topic, setTopic] = useState({ guideTeachers: [] });
  const [afterMidMarkStartTime, setAfterMidMarkStartTime] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const markSuccess = () => {
    toastHolder.success("Đánh giá giữa kỳ thành công");
    setRefresh(!refresh);
  };

  useEffect(() => {
    api.get(`/topics/detail/${topicId}`).then((res) => {
      setTopic(res);
      api
        .get(`/semesters/compare-mid-mark-start-time`, {
          params: { thesis: res.thesis, before: false },
        })
        .then(setAfterMidMarkStartTime);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <CCard>
      <CCardHeader>
        <h5>{topic.name?.vi}</h5>
        <h5>{topic.name?.en}</h5>
      </CCardHeader>

      <CCardHeader>
        <TopicDetailBody topic={topic} />
        {/* <CButtonGroup
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
        </CButtonGroup> */}
      </CCardHeader>

      {topic.students?.length > 0 &&
        (topic.semester?.id !== context.semester.id ||
          afterMidMarkStartTime) && (
          <>
            <MidMark topic={topic} markSuccess={markSuccess} />
            {topic.students?.some((e) => e.midPass) && (
              <FinalMark guide={true} topic={topic} />
            )}
          </>
        )}
    </CCard>
  );
};

export default MainComponent;
