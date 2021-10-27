import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CListGroup,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import UserCard from "src/components/UserCard";
import api from "src/service/api";

const TopicCreate = () => {
  const topicId = window.location.pathname.match(/topics\/(\d+)/, "")[1];

  const history = useHistory();
  const [topic, setTopic] = useState({ guideTeachers: [] });

  useEffect(() => {
    api.get(`/topics/detail/${topicId}`).then(setTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardHeader>
        <h5>{topic.name?.vi}</h5>
        <h5>{topic.name?.en}</h5>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md="3">
            <CRow>
              <CCol className="col-md-auto">Loại đề tài:</CCol>
              <CCol>{topic.type}</CCol>
            </CRow>
            <br />
            <CRow>
              <CCol className="col-md-auto">Phương thức đào tạo:</CCol>
              <CCol>
                {topic.educationMethodNames?.map((e) => (
                  <CRow key={e}>{e}</CRow>
                ))}
              </CCol>
            </CRow>
            <br />
            <CRow>
              <CCol className="col-md-auto">Chuyên ngành:</CCol>
              <CCol>
                {topic.majorNames?.map((e) => (
                  <CRow key={e}>{e}</CRow>
                ))}
              </CCol>
            </CRow>
            <br />
            <CRow>
              <CCol className="col-md-auto">
                Số lượng sinh viên: {topic.minStudentTake}
                {"->"}
                {topic.maxStudentTake}
              </CCol>
            </CRow>
          </CCol>
          <CCol md="4">
            Giáo viên hướng dẫn
            {topic.guideTeachers && <UserCard user={topic.guideTeachers[0]} />}
            {topic.guideTeachers.length > 1 && (
              <>
                <br />
                Giáo viên đồng hướng dẫn
                {topic.guideTeachers?.slice(1, 3).map((guideTeacher) => (
                  <UserCard key={guideTeacher.id} user={guideTeacher} />
                ))}
              </>
            )}
            <br />
            Giáo viên phản biện
            {topic.reviewTeachers?.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </CCol>
          <CCol>
            Sinh viên thực hiện
            <CListGroup>
              {topic.students?.map((student) => (
                <UserCard key={student.id} user={student} />
              ))}
            </CListGroup>
          </CCol>
        </CRow>
        <br />
        <CRow>
          <CCol md="1">Mô tả</CCol>
          <CCol>{topic.description}</CCol>
        </CRow>
        <br />
        <CRow>
          <CCol md="1">Nhiệm vụ</CCol>
          <CCol>{topic.task}</CCol>
        </CRow>
        <br />
        <CRow>
          <CCol md="1">Tài liệu</CCol>
          <CCol>{topic.documentReference}</CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default TopicCreate;
