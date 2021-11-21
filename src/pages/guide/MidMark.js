import {
  CButton,
  CCardHeader,
  CDataTable,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSwitch,
} from "@coreui/react";
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
  const [confirm, setConfirm] = React.useState(false);
  const [confirmProps, setConfirmProps] = React.useState({});

  const templateToField = (template) => {
    return { key: "template" + template.id, label: template.name };
  };

  const midMark = (student, value) => {
    const topicStudent = midResult.find((e) => e.studentId === student.id);
    setConfirmProps({ topicStudent, value, student });
    setConfirm(true);
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
      <ConfirmMidMark
        view={confirm}
        disableView={() => setConfirm(false)}
        confirm={() => setToggle(!toggle)}
        {...confirmProps}
      />
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

const ConfirmMidMark = ({
  view,
  disableView,
  confirm,
  topicStudent,
  student = {},
  value,
}) => {
  const midMark = () => {
    const nextTopicStudent = {
      id: topicStudent.id,
      topic: { id: topicStudent.topic.id },
      student: { id: topicStudent.studentId },
      midPass: value,
    };
    api.patch(`/topic-student`, nextTopicStudent).then(() => {
      disableView();
      confirm();
    });
  };

  return (
    <CModal color="warning" size="md" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Xác nhận</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <center>
          <h5>
            Sinh viên {student.code} {student.fullName}{" "}
            <strong>{value ? "qua giữa kỳ" : "trượt giữa kỳ"}</strong>
          </h5>
        </center>
      </CModalBody>
      <CModalFooter>
        <CButton color="info" onClick={midMark}>
          Xác nhận
        </CButton>
        <CButton color="secondary" onClick={disableView}>
          Quay về
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MainComponent;
