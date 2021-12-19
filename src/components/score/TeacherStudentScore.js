import { CDataTable } from "@coreui/react";
import React, { useEffect } from "react";
import api from "src/service/api";

const fields = [
  { key: "code", label: "MSCB", _style: { width: 1 } },
  { key: "fullName", label: "Giáo viên", _style: { width: 150 } },
  { key: "email", label: "Email", _style: { width: 200 } },
];

const MainComponent = ({
  topic = {},
  student = {},
  template = {},
  teachers = [],
}) => {
  const [templates, setTemplates] = React.useState([]);
  const [data, setData] = React.useState([]);

  const dataToField = () =>
    templates?.map((e) => {
      return { key: "template" + e.id, label: e.name };
    });

  useEffect(() => {
    api
      .post(`/templates/example`, {
        thesis: topic.thesis,
        midSemester: false,
        majors: topic.majors,
        ...template,
      })
      .then(setTemplates);
    api
      .post(`/scores/teacher?teacherIds=${teachers.map((e) => e.id)}`, {
        topic: { id: topic.id },
        student: { id: student.id },
        template: {
          thesis: topic.thesis,
          midSemester: false,
          ...template,
        },
      })
      .then((res) => {
        setData(res);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderScore = (template, user) => {
    const studentHasScore = data.find((e) => e.id === user.id);
    const studentHasTemplateScore = studentHasScore?.templates?.find(
      (e) => e.id === template.id
    );

    return (
      <td>
        {studentHasTemplateScore?.scores.join(", ")}
        {template.numberMark && studentHasTemplateScore && (
          <div className="float-right">
            Tổng:{studentHasTemplateScore.totalScore}
          </div>
        )}
      </td>
    );
  };

  if (data?.length < 1) return <div></div>;
  if (templates.length < 1) return <div></div>;

  return (
    <>
      <strong>{`Giáo viên ${
        template.guideTeacher ? "hướng dẫn" : "phản biện"
      }`}</strong>
      <CDataTable
        fields={[...fields, ...dataToField()]}
        items={data}
        size="sm"
        scopedSlots={{
          ...templates?.reduce(
            (a, v) => ({
              ...a,
              ["template" + v.id]: (item) => renderScore(v, item),
            }),
            {}
          ),
        }}
      />
    </>
  );
};

export default MainComponent;
