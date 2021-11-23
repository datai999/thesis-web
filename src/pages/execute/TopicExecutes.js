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
import TeacherStudentScore from "src/components/score/TeacherStudentScore";
import MidMark from "src/pages/guide/MidMark";
import { TopicDetailBody } from "src/pages/topic/TopicDetail";
import api from "src/service/api";
import { context } from "src/service/contextService";
import toastHolder from "src/service/toastService";
import CancelTopicModal from "./CancelTopicModal";

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

            {topic.students?.length > 0 &&
              (topic.semester?.id !== context.semester.id ||
                !cancelTopicModal) && (
                <>
                  <MidMark topic={topic} />
                  {topic.students?.some((e) => e.midPass) && (
                    <CCardHeader>
                      <div style={{ width: "90%" }}>
                        <h5>Kết quả đánh giá cuối kỳ</h5>
                        <div className="ml-4">
                          <strong>Giáo viên hướng dẫn</strong>
                          <TeacherStudentScore
                            topic={{
                              id: topic.id,
                              guideTeachers: topic.guideTeachers,
                            }}
                            student={context.user}
                          />
                          <strong>Giáo viên phản biện</strong>
                          <TeacherStudentScore
                            topic={{
                              id: topic.id,
                              reviewTeachers: topic.reviewTeachers,
                            }}
                            student={context.user}
                          />
                        </div>
                      </div>
                    </CCardHeader>
                  )}
                </>
              )}
          </CCollapse>
        </CCard>
      ))}
    </>
  );
};

export default TopicExecutes;
