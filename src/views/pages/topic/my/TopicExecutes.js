import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CListGroup,
  CListGroupItem,
  CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import api from "../../../../service/api";

const TopicExecutes = () => {
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([0, 1]);

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
                <CCol>
                  Giáo viên hướng dẫn
                  <CListGroup>
                    {topic.guideTeachers?.map((guideTeacher) => (
                      <CListGroupItem key={guideTeacher} component="a" href="#">
                        {guideTeacher.degreeName}
                        {"  : "}
                        {guideTeacher.firstName} {guideTeacher.lastName}
                        <br />
                        Mã số: {guideTeacher.code}
                        <br />
                        {guideTeacher.email}
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCol>
                <CCol>
                  Sinh viên thực hiện
                  <CListGroup>
                    {topic.students?.map((student) => (
                      <CListGroupItem key={student} component="a" href="#">
                        {student.firstName} {student.lastName}
                        <br />
                        Mã số: {student.code}
                        <br />
                        {student.email}
                      </CListGroupItem>
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
          </CCollapse>
        </CCard>
      ))}
    </div>
  );
};

export default TopicExecutes;
