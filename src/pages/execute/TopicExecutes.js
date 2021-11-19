import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardHeader,
  CCollapse,
  CTooltip,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { TopicDetailBody } from "src/pages/topic/TopicDetail";
import api from "src/service/api";
import { context } from "src/service/contextService";
import toastHolder from "src/service/toastService";
import CancelTopicModal from "../my/topic/CancelTopicModal";

const TopicExecutes = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([0, 1]);
  const [cancelTopicModal, setCancelTopicModal] = useState(false);
  const [topicCancel, setTopicCancel] = useState();
  const [canCancel, setCanCancel] = useState(false);

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  const viewCouncilDetail = (council) => {
    if (council?.id) {
      history.push(`/councils/detail/${council?.id}`);
    } else {
      toastHolder.warning("Đề tài không có hội đồng");
    }
  };

  useEffect(() => {
    api.get(`/students/${context.user.id}/topics`).then((res) => {
      setData(res);
    });
    api.get(`/semesters/allow-student-register-cancel`).then(setCanCancel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CancelTopicModal
        view={cancelTopicModal}
        disableView={() => setCancelTopicModal(false)}
        confirm={() => history.go("/execute")}
        topic={topicCancel}
      />

      {data.map((topic, index) => (
        <CCard key={index} className="mb-2">
          <CCardHeader className="m-0 p-0">
            <CButton
              block
              color="dark"
              className="text-left m-0 p-0 pl-3"
              onClick={() => toggleDetails(index)}
            >
              {topic.names && topic.names[0]}
              <br />
              {topic.names && topic.names[1]}
            </CButton>
          </CCardHeader>
          <CCollapse show={details.includes(index)}>
            <TopicDetailBody topic={topic} />

            <CButtonGroup
              vertical
              size="sm"
              style={{ position: "absolute", top: 50, right: 5 }}
            >
              {topic.thesis && (
                <CTooltip content={"Hội đồng"}>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => viewCouncilDetail(topic.council)}
                  >
                    <CIcon name="cil-people" />
                  </CButton>
                </CTooltip>
              )}

              {!canCancel && (
                <CTooltip content={"Bảng điểm"}>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => {
                      history.push(`/score/topic/${topic.id}`);
                    }}
                  >
                    <CIcon name="cil-calculator" />
                  </CButton>
                </CTooltip>
              )}

              {topic.semester.id === context.semester.id && canCancel && (
                <CTooltip content={"Hủy đăng ký đề tài"}>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => {
                      setTopicCancel(topic);
                      setCancelTopicModal(true);
                    }}
                  >
                    <CIcon name="cil-x-circle" />
                  </CButton>
                </CTooltip>
              )}
            </CButtonGroup>
          </CCollapse>
        </CCard>
      ))}
    </>
  );
};

export default TopicExecutes;
