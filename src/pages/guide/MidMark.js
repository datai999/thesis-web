import {
  CButton,
  CCardHeader,
  CCol,
  CDataTable,
  CForm,
  CFormGroup,
  CInput,
  CInputRadio,
  CInvalidFeedback,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React, { useEffect } from "react";
import api from "src/service/api";
import { context } from "src/service/contextService";

const fields = [
  { key: "code", label: "MSSV", _style: { width: 1 } },
  { key: "fullName", label: "Sinh viên", _style: { width: 200 } },
  {
    key: "result",
    label: "Kết quả giữa kỳ",
    _style: { width: 200 },
  },
  {
    key: "reason",
    label: "Đánh giá",
  },
];

const MainComponent = ({ topic = {}, markSuccess = () => {} }) => {
  const semesterName = window.location.pathname.split("/")[2];
  const canEdit = topic.guideTeachers?.some((e) => e.id === context.user.id);
  const midResult = topic.students?.map((e) => {
    return { ...e, id: e.relationId, topic: topic, studentId: e.id };
  });

  const [confirm, setConfirm] = React.useState(false);
  const [confirmProps, setConfirmProps] = React.useState({});
  const [refresh, setRefresh] = React.useState(true);
  const [beforeMidMarkEnd, setBeforeMidMarkEnd] = React.useState(false);

  const midMark = (student, value) => {
    const topicStudent = midResult.find((e) => e.studentId === student.id);
    setConfirmProps({ topicStudent, value, student, reason: null });
    setConfirm(true);
  };

  useEffect(() => {
    api
      .get(`/semesters/compare-mid-mark-end-time`, {
        params: { thesis: topic.thesis, before: true },
      })
      .then(setBeforeMidMarkEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const renderSwitchResult = (student) => {
    const studentMidResult =
      midResult.find((e) => e.studentId === student.id) ?? {};
    return (
      <td>
        {canEdit && beforeMidMarkEnd ? (
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
      <div className="ml-4" style={{ width: 700 }}>
        <CDataTable
          fields={fields}
          items={topic.students}
          size="sm"
          scopedSlots={{
            result: renderSwitchResult,
            reason: (item) => (
              <td>{midResult.find((e) => e.studentId === item.id)?.reason}</td>
            ),
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
  ...props
}) => {
  const [reason, setReason] = React.useState(props.reason);

  const midMark = () => {
    const nextTopicStudent = {
      id: topicStudent.id,
      topic: { id: topicStudent.topic.id },
      student: { id: topicStudent.studentId },
      midPass: value,
      reason: reason,
    };
    api.patch(`/topic-student`, nextTopicStudent).then(() => {
      disableView();
      confirm();
    });
  };

  React.useEffect(() => {
    setReason(null);
  }, [view]);

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

          <br />

          <CForm style={{ width: 400 }} className="ml-5">
            <CFormGroup row>
              <CLabel htmlFor="reason">
                <strong>Đánh giá</strong>
              </CLabel>
              <CCol md="8">
                <CInput
                  id="reason"
                  invalid={!value && (!reason || reason?.length < 1)}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                />
                {!value && (!reason || reason?.length < 1) && (
                  <CInvalidFeedback>
                    Cần lý do để đánh giá sinh viên <strong>không đạt</strong>
                  </CInvalidFeedback>
                )}
              </CCol>
            </CFormGroup>
          </CForm>
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
