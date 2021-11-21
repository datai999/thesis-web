import { CButton, CCardHeader, CDataTable, CSwitch } from "@coreui/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "src/service/api";

const fields = [
  { key: "code", label: "MSSV" },
  { key: "fullName", label: "Sinh viên" },
];

const MainComponent = ({ topic = {} }) => {
  const history = useHistory();
  const topicId = window.location.pathname.split("/")[3];

  const [templates, setTemplates] = React.useState([]);
  const [midResult, setMidResult] = React.useState([]);
  const [toggle, setToggle] = React.useState(false);

  const templateToField = (template) => {
    return { key: "template" + template.id, label: template.name };
  };

  const midMark = (student, value) => {
    const topicStudent = midResult.find((e) => e.studentId === student.id);
    const nextTopicStudent = {
      id: topicStudent.id,
      topic: { id: topicStudent.topic.id },
      student: { id: topicStudent.studentId },
      midPass: value,
    };
    api
      .patch(`/topic-student`, nextTopicStudent)
      .then(() => setToggle(!toggle));
  };

  useEffect(() => {
    api
      .post(`/templates/example`, {
        thesis: topic.thesis,
        midSemester: true,
        guideTeacher: true,
      })
      .then(setTemplates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api
      .post(`/topic-student/example`, {
        topicId: topic.id,
      })
      .then((res) => {
        setMidResult(res);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);

  const renderSwitchResult = (student) => {
    const checked = midResult.some(
      (e) => e.studentId === student.id && e.midPass
    );
    return (
      <center>
        <CSwitch
          color="primary"
          labelOn={"\u2713"}
          labelOff={"\u2715"}
          checked={checked}
          onChange={(e) => midMark(student, e.currentTarget.checked)}
        />
      </center>
    );
  };

  return (
    <CCardHeader>
      <h5>Đánh giá giữa kỳ</h5>
      <div className="ml-4" style={{ width: 400 }}>
        <CDataTable
          fields={[
            ...fields,
            // ...templates.map(templateToField),
            {
              key: "result",
              label: "Đạt/Không đạt",
              _style: { width: 110 },
            },
          ]}
          items={topic.students}
          striped
          size="sm"
          scopedSlots={{
            ...templates.reduce(
              (a, v) => ({
                ...a,
                ["template" + v.id]: (item) => (
                  <td>
                    <CButton
                      color="primary"
                      size="sm"
                      onClick={() =>
                        history.push(`${window.location.pathname}/mark`, {
                          template: v,
                          topicId: topicId,
                          studentId: item.id,
                        })
                      }
                    >
                      Đánh giá
                    </CButton>
                  </td>
                ),
              }),
              {}
            ),
            result: renderSwitchResult,
          }}
        />
      </div>
    </CCardHeader>
  );
};

export default MainComponent;
