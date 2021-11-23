import { CDataTable } from "@coreui/react";
import React, { useEffect } from "react";
import api from "src/service/api";

const fields = [
  { key: "code", label: "MSCB" },
  { key: "fullName", label: "Giáo viên" },
];

const MainComponent = ({ topic = {}, student = {} }) => {
  const [data, setData] = React.useState([]);

  const dataToField = () =>
    data?.length < 1
      ? []
      : data[0].templates.map((e) => {
          return { key: "template" + e.id, label: e.name };
        });

  useEffect(() => {
    api
      .post(`/scores/teacher`, {
        topic: topic,
        student: { id: student.id },
        template: {
          thesis: topic.thesis,
          midSemester: false,
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
    <CDataTable
      fields={[...fields, ...dataToField()]}
      items={data}
      striped
      size="sm"
      scopedSlots={{
        ...data[0]?.templates.reduce(
          (a, v) => ({
            ...a,
            ["template" + v.id]: (item) => renderScore(v, item),
          }),
          {}
        ),
      }}
    />
  );
};

export default MainComponent;
