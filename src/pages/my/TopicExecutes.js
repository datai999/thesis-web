import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CListGroup,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import UserCard from "src/components/UserCard";
import api from "src/service/api";
import CancelTopicModal from "./topic/CancelTopicModal";

const TopicExecutes = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([0, 1]);
  const [cancelTopicModal, setCancelTopicModal] = useState(false);
  const [topicCancel, setTopicCancel] = useState();

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  useEffect(() => {
    const getData = async () => {
      const userId = await window.localStorage.getItem("userId");
      api
        .get(`/topics/user`, {
          params: {
            userId: userId,
            topicRole: "STUDENT",
            direction: "DESC",
          },
        })
        .then(setData);
    };
    getData();
  }, []);

  return (
    <div className="pt-3">
      <CancelTopicModal
        view={cancelTopicModal}
        disableView={() => setCancelTopicModal(false)}
        confirm={() => history.go("/my/topics/execute")}
        topic={topicCancel}
      />
      {data.map((topic, index) => (
        <CCard key={index} className="mb-2">
          <CCardHeader className="m-0 p-0">
            <CButton
              block
              color="dark"
              className="text-left m-0 p-0"
              onClick={() => toggleDetails(index)}
            >
              <CRow>
                <CCol className="col-md-auto pl-4">
                  Mã số: {topic.id}
                  <br />
                  Học kỳ: {topic.semester}
                </CCol>
                <CCol className="col-md">
                  {topic.names && topic.names[0]}
                  <br />
                  {topic.names && topic.names[1]}
                </CCol>
              </CRow>
            </CButton>
          </CCardHeader>
          <CCollapse show={details.includes(index)}>
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
                      {topic.educationMethodNames.map((e) => (
                        <CRow key={e}>{e}</CRow>
                      ))}
                    </CCol>
                  </CRow>
                  <br />
                  <CRow>
                    <CCol className="col-md-auto">Chuyên ngành:</CCol>
                    <CCol>
                      {topic.majorNames.map((e) => (
                        <CRow key={e}>{e}</CRow>
                      ))}
                    </CCol>
                  </CRow>
                </CCol>
                <CCol md="4">
                  Giáo viên hướng dẫn
                  {topic.guideTeachers?.map((guideTeacher) => (
                    <UserCard key={guideTeacher.id} user={guideTeacher} />
                  ))}
                </CCol>
                <CCol md="4">
                  Sinh viên thực hiện
                  <CListGroup>
                    {topic.students?.map((student) => (
                      <UserCard key={student.id} user={student} />
                    ))}
                  </CListGroup>
                </CCol>
                <CCol md="1">
                  <CButton
                    block
                    color="danger"
                    size="sm"
                    className="m-0 p-0"
                    onClick={() => {
                      setTopicCancel(topic);
                      setCancelTopicModal(true);
                    }}
                  >
                    Hủy chọn đề tài
                  </CButton>
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
          </CCollapse>
        </CCard>
      ))}
    </div>
  );
};

export default TopicExecutes;
