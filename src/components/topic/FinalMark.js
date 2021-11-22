import { CButton, CCardHeader, CDataTable } from "@coreui/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "src/service/api";
import context from "src/service/contextService";

const fields = [
  { key: "code", label: "MSSV" },
  { key: "fullName", label: "Sinh viên" },
];

const MainComponent = ({ guide = true, topic = {} }) => {
  const history = useHistory();

  const [templates, setTemplates] = React.useState([]);
  const [data, setData] = React.useState([]);

  const templateToField = (template) => {
    return { key: "template" + template.id, label: template.name };
  };

  useEffect(() => {
    api
      .post(`/templates/example`, {
        thesis: topic.thesis,
        midSemester: false,
        guideTeacher: guide ? true : null,
        reviewTeacher: guide ? null : true,
      })
      .then(setTemplates);

    api
      .post(`/scores/student`, {
        topic: { id: topic.id },
        teacher: { id: context.user.id },
        template: {
          thesis: topic.thesis,
          midSemester: false,
          guideTeacher: guide ? true : null,
          reviewTeacher: guide ? null : true,
        },
      })
      .then((res) => {
        setData(res);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderScore = (template, student) => {
    const studentHasScore = data.find((e) => e.id === student.id);
    const studentHasTemplateScore = studentHasScore?.templates?.find(
      (e) => e.id === template.id
    );

    if (template.numberMark && studentHasTemplateScore)
      console.log(
        studentHasTemplateScore?.scores
          ?.map(parseInt)
          .reduce((a, b) => a + b, 0)
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
    <CCardHeader>
      <h5>{guide ? "Đánh giá cuối kỳ" : "Đánh giá phản biện"}</h5>
      <div className="ml-4" style={{ width: "90%" }}>
        <CDataTable
          fields={[...fields, ...templates.map(templateToField)]}
          items={topic.students}
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
    </CCardHeader>
  );
};

export default MainComponent;
