import {
  CButton,
  CCard,
  CCardFooter,
  CCardHeader,
  CDataTable,
} from "@coreui/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { TopicDetailBody } from "src/pages/topic/TopicDetail";
import api from "src/service/api";
import context from "src/service/contextService";

const fields = [
  { key: "code", label: "MSSV" },
  { key: "fullName", label: "Sinh viên" },
];

const MainComponent = () => {
  const history = useHistory();
  const councilId = window.location.pathname.split("/")[3];
  const topicId = window.location.pathname.split("/")[4];

  const [templates, setTemplates] = React.useState([]);
  const [scores, setScores] = React.useState([]);
  const [topic, setTopic] = React.useState([]);

  const templateToField = (template) => {
    return { key: "template" + template.id, label: template.name };
  };

  useEffect(() => {
    api.get(`/topics/detail/${topicId}`).then((res) => {
      api
        .post(
          `/templates/council`,
          {
            thesis: res.thesis,
            midSemester: false,
            majors: res.majors,
          },
          {
            params: {
              councilId,
              teacherId: context.user?.id,
            },
          }
        )
        .then(setTemplates);

      api
        .post(`/scores/student`, {
          topic: { id: res.id },
          teacher: { id: context.user.id },
          template: {
            thesis: res.thesis,
            midSemester: false,
          },
        })
        .then(setScores);

      setTopic(res);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderScore = (template, student) => {
    const studentHasScore = scores.find((e) => e.id === student.id);
    const studentHasTemplateScore = studentHasScore?.templates?.find(
      (e) => e.id === template.id
    );

    return (
      <td>
        <CButton
          color="primary"
          size="sm"
          onClick={() =>
            history.push(`${window.location.pathname}/mark`, {
              template: template,
              topic: topic,
              student: student,
              successPath: window.location.pathname,
              councilRole: templates[0]?.councilRoles[0],
            })
          }
        >
          Đánh giá
        </CButton>{" "}
        {studentHasTemplateScore?.scores?.join(", ")}
        {template.numberMark && studentHasTemplateScore && (
          <div className="float-right">
            Tổng:{studentHasTemplateScore.totalScore}
          </div>
        )}
      </td>
    );
  };

  return (
    <CCard>
      <CCardHeader>
        <h5>{topic.name?.vi}</h5>
        <h5>{topic.name?.en}</h5>
      </CCardHeader>

      <TopicDetailBody topic={topic} />

      <CCardFooter>
        <h5>{"Đánh giá cuối kỳ"}</h5>
        <div style={{ width: "90%" }}>
          <CDataTable
            fields={[...fields, ...templates?.map(templateToField)]}
            items={topic.students?.filter((e) => e.midPass)}
            striped
            size="sm"
            scopedSlots={{
              ...templates.reduce(
                (a, v) => ({
                  ...a,
                  ["template" + v.id]: (item) => renderScore(v, item),
                }),
                {}
              ),
            }}
          />
        </div>
      </CCardFooter>
    </CCard>
  );
};

export default MainComponent;
