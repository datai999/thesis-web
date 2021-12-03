import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardHeader,
  CCollapse,
  CLink,
  CTooltip,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import TeacherStudentScore from "src/components/score/TeacherStudentScore";
import { CouncilInfoModal } from "src/pages/council/CouncilInfo";
import MidMark from "src/pages/guide/MidMark";
import { TopicDetailBody } from "src/pages/topic/TopicDetail";
import api from "src/service/api";
import { context } from "src/service/contextService";
import CancelTopicModal from "./CancelTopicModal";

const TopicExecutes = () => {
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([0, 1]);
  const [cancelTopicModal, setCancelTopicModal] = useState(false);
  const [topicCancel, setTopicCancel] = useState();
  const [canCancel, setCanCancel] = useState(false);
  const [councilView, setCouncilView] = useState(false);
  const [refresh, setRefresh] = useState(false);

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

  const viewFinal = (topic) =>
    topic.students?.length > 0 &&
    (topic.semester?.id !== context.semester.id || !cancelTopicModal);

  useEffect(() => {
    api.get(`/students/${context.user.id}/topics`).then((res) => {
      setData(res);
    });
    api.get(`/semesters/allow-student-register-cancel`).then(setCanCancel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <>
      <CancelTopicModal
        view={cancelTopicModal}
        disableView={() => setCancelTopicModal(false)}
        confirm={() => setRefresh(!refresh)}
        topic={topicCancel}
      />

      {data.map((topic, index) => (
        <CCard key={index} className="mb-2">
          <CCardHeader className="m-0 p-0">
            <CButton
              block
              color="dark"
              className="text-left m-0 p-0 pl-3 py-2"
              onClick={() => toggleDetails(index)}
            >
              {topic.names && topic.names[0]}
              <br />
              {topic.names && topic.names[1]}
            </CButton>
          </CCardHeader>
          <CCollapse show={details.includes(index)}>
            <CCardHeader>
              <TopicDetailBody topic={topic} />

              <CButtonGroup
                vertical
                size="sm"
                style={{ position: "absolute", top: 50, right: 5 }}
              >
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
            </CCardHeader>

            {viewFinal(topic) && (
              <>
                <MidMark topic={topic} />
                {topic.students?.some(
                  (e) => e.midPass && e.id === context.user.id
                ) && (
                  <CCardHeader>
                    <div style={{ width: "90%" }}>
                      <h5>Kết quả đánh giá cuối kỳ</h5>
                      <div className="ml-4">
                        <strong>Giáo viên hướng dẫn</strong>
                        <TeacherStudentScore
                          topic={topic}
                          student={context.user}
                          template={{ guideTeacher: true }}
                          teachers={topic.guideTeachers}
                        />
                        {topic.reviewTeachers?.length > 0 && (
                          <>
                            <strong>Giáo viên phản biện</strong>
                            <TeacherStudentScore
                              topic={topic}
                              student={context.user}
                              template={{ reviewTeacher: true }}
                              teachers={topic.reviewTeachers}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </CCardHeader>
                )}
              </>
            )}

            {viewFinal(topic) && topic.thesis && topic.council && (
              <CCardHeader>
                <CouncilInfoModal
                  view={councilView}
                  disableView={() => setCouncilView(false)}
                  council={topic.council}
                />

                <div style={{ width: "90%" }}>
                  <h5>
                    Kết quả đánh giá của{" "}
                    <CLink onClick={() => setCouncilView(true)}>
                      hội đồng
                      {topic.council ? ` mã số ${topic.council?.id}` : ""}
                    </CLink>
                  </h5>

                  <div className="ml-4">
                    {Object.entries(
                      _.groupBy(topic.council?.members, (e) => e.role.name)
                    )
                      .sort(
                        (a, b) =>
                          a[1][0].role.displayOrder - b[1][0].role.displayOrder
                      )
                      .map((e) => (
                        <>
                          <strong>{e[0]}</strong>
                          <TeacherStudentScore
                            topic={topic}
                            student={context.user}
                            template={{
                              councilRoles: [{ id: e[1][0].role?.id }],
                            }}
                            teachers={e[1].map(
                              (councilRole) => councilRole.member
                            )}
                          />
                        </>
                      ))}
                  </div>
                </div>
              </CCardHeader>
            )}
          </CCollapse>
        </CCard>
      ))}
    </>
  );
};

export default TopicExecutes;
