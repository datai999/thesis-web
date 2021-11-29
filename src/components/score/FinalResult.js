import { CCardHeader, CCol, CRow } from "@coreui/react";
import React from "react";
import api from "src/service/api";

const commonProps = { md: 0, className: "border" };

const PROPS = {
  ROLE: {
    ...commonProps,
    style: { maxWidth: 90 },
  },
  TEACHER: { ...commonProps, style: { maxWidth: 200 } },
  STUDENT: { ...commonProps, style: { maxWidth: 250 } },
};

const MainComponent = ({ topic = {} }) => {
  const studentPassMid = topic.students?.filter((e) => e.midPass);

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    api.get(`/scores/topic/${topic.id}`).then(setData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderScore = (template) => {
    return (
      <>
        <CCol>{template.scores.join(", ")}</CCol>
        {template.numberMark && (
          <CCol md="0" className="float-right">
            Tổng:{template.totalScore}
          </CCol>
        )}
      </>
    );
  };

  return (
    <CCardHeader>
      <h5>Kết quả đánh giá cuối kỳ</h5>
      <div className="ml-4">
        <CRow>
          <CCol {...PROPS.ROLE}>
            <strong>Vai trò</strong>
          </CCol>
          <CCol {...PROPS.TEACHER}>
            <strong>Giáo viên đánh giá</strong>
          </CCol>
          {studentPassMid.map((e) => (
            <CCol {...PROPS.STUDENT}>
              <strong>{e.fullName}</strong>
            </CCol>
          ))}
        </CRow>
        {data.map((role) => (
          <CRow>
            <CCol {...PROPS.ROLE}>
              <strong>{role.name}</strong>
            </CCol>
            <CCol>
              {role.teachers.map((teacher) => (
                <CRow>
                  <CCol {...PROPS.TEACHER}>{teacher.fullName}</CCol>
                  {teacher.students.map((student) => (
                    <CCol {...PROPS.STUDENT}>
                      {student.templates.map((template) => (
                        <CRow className="border">{renderScore(template)}</CRow>
                      ))}
                    </CCol>
                  ))}
                </CRow>
              ))}
            </CCol>
          </CRow>
        ))}
      </div>
    </CCardHeader>
  );
};

export default MainComponent;
