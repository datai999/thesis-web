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

const TopicCreate = () => {
  const history = useHistory();
  const topicId = window.location.pathname.match(/topics\/(\d+)/, "")[1];

  const [topic, setTopic] = useState({ guideTeachers: [] });
  const [registerTopicModal, setRegisterTopicModal] = useState(false);
  const [canRegister, setCanRegister] = useState(false);

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
      <CCardHeader className="mx-5">
        <h5>{topic.name?.vi}</h5>
        <h5>{topic.name?.en}</h5>
      </CCardHeader>
      <CCardBody className="mx-5">
        <CRow>
          <CCol md="3">
            <div>
              <strong>Mã số: </strong>
              {topic.id}
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
              <strong>Chuyên ngành: </strong>
              {topic.majorNames?.join(", ")}
            </div>
          </CCol>
        </CRow>

        <br />

        <CRow>
          <CCol md="4">
            <strong>Giáo viên hướng dẫn</strong>
            {topic.guideTeachers && <UserCard user={topic.guideTeachers[0]} />}
          </CCol>
          {topic.guideTeachers.length > 1 && (
            <CCol>
              <strong>Giáo viên đồng hướng dẫn</strong>
              {topic.guideTeachers?.slice(1, 3).map((guideTeacher) => (
                <UserCard key={guideTeacher.id} user={guideTeacher} />
              ))}
            </CCol>
          )}
        </CRow>

        <RegisterTopicModal
          view={registerTopicModal}
          disableView={() => setRegisterTopicModal(false)}
          confirm={() => history.push("/execute")}
          topic={topic}
        />

        <strong>Sinh viên thực hiện</strong>
        <CRow>
          {topic.students?.map((student) => (
            <CCol>
              <UserCard key={student.id} user={student} />
            </CCol>
          ))}
          {_.range(topic.students?.length, topic.maxStudentTake).map((e) => (
            <CCol key={e} className="border mx-3 py-3">
              <CButton
                type="button"
                color="info"
                disabled={!canRegister}
                onClick={() => {
                  setRegisterTopicModal(true);
                }}
              >
                Đăng ký
              </CButton>
            </CCol>
          ))}
        </CRow>

        <br />

        <div className="my-2">
          <strong>Mô tả</strong>
          <div className="border p-2">{topic.description}</div>
        </div>

        <div className="my-2">
          <strong>Nhiệm vụ</strong>
          <div className="border p-2">{topic.task}</div>
        </div>

        <div className="my-2">
          <strong>Tài liệu</strong>
          <div className="border p-2">{topic.documentReference}</div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default TopicCreate;
