import {
  CButton,
  CCardHeader,
  CDataTable,
  CForm,
  CFormGroup,
  CInputRadio,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "src/service/api";
import { context } from "src/service/contextService";

const fields = [
  { key: "code", label: "MSSV" },
  { key: "fullName", label: "Sinh viên" },
];

const MainComponent = ({ topic = {}, markSuccess = () => {} }) => {
  const history = useHistory();
  const semesterName = window.location.pathname.split("/")[2];
  const topicId = window.location.pathname.split("/")[3];
  const canEdit = topic.guideTeachers?.some((e) => e.id === context.user.id);

  const [templates, setTemplates] = React.useState([]);
  const [midResult, setMidResult] = React.useState([]);
  const [confirm, setConfirm] = React.useState(false);
  const [confirmProps, setConfirmProps] = React.useState({});
  const [refresh, setRefresh] = React.useState(true);

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
        majors: topic.majors,
      })
      .then(setTemplates);

    api
      .post(`/topic-student/example`, {
        topic: { id: topic.id },
      })
      .then((res) => {
        setMidResult(res);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const renderSwitchResult = (student) => {
    const studentMidResult =
      midResult.find((e) => e.studentId === student.id) ?? {};
    return (
      <td>
        {canEdit ? (
          <CForm>
            <fieldset disabled={semesterName !== context.semester?.name}>
              <CFormGroup variant="custom-radio" inline>
                <CInputRadio
                  custom
                  id={`${student.id}pass`}
                  name={`${student.id}mid`}
                  checked={studentMidResult.midPass}
                  onChange={() => midMark(student, true)}
                />
                <CLabel variant="custom-checkbox" htmlFor={`${student.id}pass`}>
                  Đạt
                </CLabel>
              </CFormGroup>
              <CFormGroup variant="custom-radio" inline>
                <CInputRadio
                  custom
                  id={`${student.id}fail`}
                  name={`${student.id}mid`}
                  checked={
                    ![null, undefined].includes(studentMidResult.midPass) &&
                    !studentMidResult.midPass
                  }
                  onChange={() => midMark(student, false)}
                />
                <CLabel variant="custom-checkbox" htmlFor={`${student.id}fail`}>
                  Không đạt
                </CLabel>
              </CFormGroup>
            </fieldset>
          </CForm>
        ) : (
          <>
            {studentMidResult.midPass
              ? "Đạt"
              : [null, undefined].includes(studentMidResult.midPass)
              ? "GVHD chưa đánh giá"
              : "Không đạt"}
          </>
        )}
      </td>
    );
  };

  return (
    <CCardHeader>
      <ConfirmMidMark
        view={confirm}
        disableView={() => setConfirm(false)}
        confirm={() => {
          markSuccess();
          setRefresh(!refresh);
        }}
        {...confirmProps}
      />
      <h5>Kết quả đánh giá giữa kỳ</h5>
      <div className="ml-4" style={{ width: 500 }}>
        <CDataTable
          fields={[
            ...fields,
            // ...templates.map(templateToField),
            {
              key: "result",
              label: "Kết quả giữa kỳ",
              _style: { width: 200 },
            },
          ]}
          items={topic.students}
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
            Đánh giá sinh viên {student.code} {student.fullName}{" "}
            <strong>{value ? "đạt" : "không đạt"}</strong> giữa kỳ
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
