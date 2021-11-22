import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import UserCard from "src/components/UserCard";
import RegisterTopicModal from "src/pages/topic/RegisterTopicModal";
import api from "src/service/api";
import context from "src/service/contextService";
import { loginUserHasAny, PERMISSIONS } from "src/service/permissionService";

const MainComponent = () => {
  const history = useHistory();
  const topicId = window.location.pathname.match(/topics\/(\d+)/, "")[1];

  const [topic, setTopic] = useState({ guideTeachers: [] });
  const [canRegister, setCanRegister] = useState(false);
  const [registerTopicModal, setRegisterTopicModal] = useState(false);

  useEffect(() => {
    api.get(`/topics/detail/${topicId}`).then((res) => {
      setTopic(res);
      if (
        loginUserHasAny([PERMISSIONS.STUDENT]) &&
        res.semester.id === context.semester.id
      )
        api
          .get(`/students/${context.user.id}/allow-register-topic`)
          .then(setCanRegister);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard className="mx-5">
      <CCardHeader className="mx-3">
        <h5>{topic.name?.vi}</h5>
        <h5>{topic.name?.en}</h5>
      </CCardHeader>
      <RegisterTopicModal
        view={registerTopicModal}
        disableView={() => setRegisterTopicModal(false)}
        confirm={() => history.push("/execute")}
        topic={topic}
      />
      <TopicDetailBody
        topic={topic}
        setRegisterTopicModal={setRegisterTopicModal}
        canRegister={canRegister}
      />
    </CCard>
  );
};

const TopicDetailBody = ({
  topic = { guideTeachers: [], students: [] },
  setRegisterTopicModal,
  canRegister = false,
}) => {
  const sliceGuideTeacher =
    12 / (topic.guideTeachers?.length < 1 ? 1 : topic.guideTeachers?.length);
  let mdGuideTeacher = sliceGuideTeacher > 4 ? 4 : sliceGuideTeacher;
  mdGuideTeacher = mdGuideTeacher < 2 ? 2 : mdGuideTeacher;
  const mdGuideTeacherToo = (mdGuideTeacher * 12) / (12 - mdGuideTeacher);

  const sliceStudent =
    12 / (topic.students?.length < 1 ? 1 : topic.students?.length);
  const mdStudent = sliceStudent > 4 ? 4 : sliceStudent;

  return (
    <CCardBody>
      <CRow>
        <CCol md="3">
          <div>
            <strong>Mã số: </strong>
            {topic.id}
          </div>
          <div>
            <strong>Học kỳ: </strong>
            {topic.semester?.name}
          </div>
          <div>
            <strong>Loại đề tài: </strong>
            {topic.type}
          </div>
        </CCol>
        <CCol>
          <div>
            <strong>Đào tạo: </strong>
            {topic.educationMethodNames?.join(", ")}
          </div>
          <div>
            <strong>Bộ môn: </strong>
            {topic.subjectDepartmentName}
          </div>
          <div>
            <strong>Chuyên ngành: </strong>
            {topic.majorNames?.join(", ")}
          </div>
        </CCol>
      </CRow>

      <br />

      <CRow>
        <CCol md={mdGuideTeacher}>
          <strong>Giáo viên hướng dẫn</strong>
          {topic.guideTeachers && <UserCard user={topic.guideTeachers[0]} />}
        </CCol>
        {topic.guideTeachers?.length > 1 && (
          <CCol>
            <strong>Giáo viên đồng hướng dẫn</strong>
            <CRow>
              {topic.guideTeachers?.slice(1, 3).map((guideTeacher) => (
                <CCol md={mdGuideTeacherToo}>
                  <UserCard key={guideTeacher.id} user={guideTeacher} />
                </CCol>
              ))}
            </CRow>
          </CCol>
        )}
      </CRow>

      <strong>Sinh viên thực hiện</strong>
      <CRow>
        {topic.students?.map((student) => (
          <CCol md={mdStudent}>
            <UserCard key={student.id} user={student} />
          </CCol>
        ))}
        {_.range(topic.students?.length, topic.maxStudentTake).map((e) => (
          <CCol key={e} md={mdStudent} className="px-3">
            <div className="border p-3">
              {canRegister ? (
                <CButton
                  type="button"
                  color="info"
                  onClick={() => {
                    setRegisterTopicModal(true);
                  }}
                >
                  Đăng ký
                </CButton>
              ) : (
                <div>SV</div>
              )}
            </div>
          </CCol>
        ))}
      </CRow>

      <br />

      <div className="my-2">
        <strong>Mô tả</strong>
        <div
          className="border p-2"
          dangerouslySetInnerHTML={{ __html: topic.description }}
        />
      </div>

      <div className="my-2">
        <strong>Nhiệm vụ</strong>
        <div
          className="border p-2"
          dangerouslySetInnerHTML={{ __html: topic.task }}
        ></div>
      </div>

      <div className="my-2">
        <strong>Tài liệu</strong>
        <div
          className="border p-2"
          dangerouslySetInnerHTML={{ __html: topic.documentReference }}
        ></div>
      </div>
    </CCardBody>
  );
};

export { TopicDetailBody };

export default MainComponent;
