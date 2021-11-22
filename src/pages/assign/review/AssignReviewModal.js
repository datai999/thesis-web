import {
  CButton,
  CCardFooter,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import React from "react";
import UserCard from "src/components/UserCard";
import TeacherSearchModal from "src/pages/teacher/TeacherSearchModal";
import { TopicDetailBody } from "src/pages/topic/TopicDetail";
import api from "src/service/api";
import { context } from "src/service/contextService";
import toastHolder from "src/service/toastService";

const MainComponent = ({ view, disableView, confirm, topic = {} }) => {
  const [searchTeachers, setSearchTeachers] = React.useState(false);
  const [teachers, setTeachers] = React.useState([]);

  const submit = () => {
    api
      .patch("/topics", { ...topic, reviewTeachers: teachers })
      .then((response) => {
        response &&
          toastHolder.success("Phân công giáo viên phản biện thành công");
        confirm(response);
      });
    disableView();
  };

  React.useEffect(() => {
    setTeachers(topic.reviewTeachers ?? []);
  }, [topic]);

  if (!topic) return null;
  return (
    <CModal color="info" size="lg" show={view} onClose={disableView}>
      <TeacherSearchModal
        view={searchTeachers}
        disableView={() => setSearchTeachers(false)}
        selected={(teacher) => {
          setSearchTeachers(false);
          setTeachers([...teachers, teacher]);
        }}
        userNotShow={teachers}
      />

      <CModalHeader closeButton>
        <CModalTitle>Phân công giáo viên phản biện</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCardHeader>
          <center>
            <h5>{topic.names && topic.names[0]}</h5>
            <h5>{topic.names && topic.names[1]}</h5>
          </center>
        </CCardHeader>

        <TopicDetailBody topic={topic} />

        <CCardFooter>
          <div>
            <strong>Gíao viên phản biện</strong>
          </div>

          <CRow>
            {teachers.map((e) => (
              <CCol md="4">
                <UserCard
                  user={e}
                  remove={() =>
                    setTeachers(
                      teachers.filter((teacher) => teacher.id !== e.id)
                    )
                  }
                />
              </CCol>
            ))}
            {topic?.semester?.id === context.semester.id && (
              <CCol md="4">
                <CButton
                  color="primary"
                  onClick={() => setSearchTeachers(true)}
                >
                  Thêm giáo viên phản biện
                </CButton>
              </CCol>
            )}
          </CRow>
        </CCardFooter>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={submit}>
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
